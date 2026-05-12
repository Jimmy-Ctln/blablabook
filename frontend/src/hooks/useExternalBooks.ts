import { useQuery } from "@tanstack/react-query";
import type {
  UseExternalBooksOptions,
  SearchBooksResponse,
  ExternalBook,
} from "@/@types/externalBooks";
import { searchExternalBooks } from "@/api/externalBooks";
import { useState, useEffect } from "react";

// Manages external book fetching with pagination and result accumulation.
//
// How pagination works:
//   - `offset` tracks how many results have been skipped on the server.
//   - Each call to `handleLoadMore` increments offset by `itemsPerPage`,
//     which changes the queryKey and triggers a new fetch.
//   - Results are appended to `allBooks` (not replaced) so the list grows.
//
// Two-effect pattern (order matters):
//   - Effect 1 resets state when `param` or `mode` changes (new search).
//   - Effect 2 accumulates results only once the fetch is fully complete.
//   React runs effects in declaration order within the same render cycle,
//   so Effect 1 always clears before Effect 2 can append stale data.
export const useExternalBooks = (options: UseExternalBooksOptions) => {
  const { mode, param, enabled: enabledOption } = options;
  const [offset, setOffset] = useState(0);
  const [allBooks, setAllBooks] = useState<ExternalBook[]>([]);
  const [hasReceivedData, setHasReceivedData] = useState(false);
  const itemsPerPage = 20;

  let queryKey: unknown[] = [];
  let queryFn: () => Promise<SearchBooksResponse>;
  let enabled = enabledOption !== undefined ? enabledOption : true;

  if (mode === "search") {
    queryKey = ["externalBooks", mode, param, offset];
    queryFn = () =>
      searchExternalBooks({
        type: "searchText",
        searchText: param!,
        limit: itemsPerPage,
        offset,
      });
    // Default: only fire when the query has at least 3 characters.
    if (enabledOption === undefined) {
      enabled = !!param && param.length >= 3;
    }
  } else if (mode === "random") {
    queryKey = ["random-external-books", mode, offset];
    queryFn = () =>
      searchExternalBooks({
        type: "random",
        limit: itemsPerPage,
        offset,
      });
  } else if (mode === "category") {
    queryKey = ["by-category-external-books", mode, param, offset];
    queryFn = () =>
      searchExternalBooks({
        type: "category",
        categoryName: param!,
        limit: itemsPerPage,
        offset,
      });
  } else {
    enabled = false;
    queryFn = async () => ({ books: [], numFound: 0, offset: 0 });
  }

  const { data, isLoading, error, isFetching } = useQuery<SearchBooksResponse>({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes.
    gcTime: 10 * 60 * 1000,   // Keep inactive cache entries for 10 minutes.
    enabled,
  });

  // Effect 1: reset accumulated state on new search (must stay BEFORE Effect 2).
  useEffect(() => {
    setAllBooks([]);
    setOffset(0);
    setHasReceivedData(false);
  }, [param, mode]);

  // Effect 2: append books once the fetch is fully done.
  // Guarding on !isFetching prevents partial data from appearing while a
  // request is still in-flight (cache revalidation, pagination, etc.).
  useEffect(() => {
    if (!isFetching && data?.books) {
      setHasReceivedData(true);
      if (offset === 0) {
        setAllBooks(data.books);
      } else {
        setAllBooks((prev) => [...prev, ...data.books]);
      }
    }
  }, [isFetching, data?.books, offset]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + itemsPerPage);
  };

  // True when the server has more results beyond the current page window.
  const hasMore = data ? offset + itemsPerPage < data.numFound : false;

  return {
    data: allBooks,
    numFound: data?.numFound ?? 0,
    offset,
    isLoading,
    isFetching,
    error,
    hasMore,
    handleLoadMore,
    hasReceivedData,
  };
};
