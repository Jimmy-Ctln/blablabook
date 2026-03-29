/**
 * Custom hook that encapsulates all user book operations:
 * - Fetching user's books with pagination
 * - Removing a book from user's library
 * - Updating book status (via dates)
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import {
  getUserBooks,
  removeBookFromUserList,
  updateBookStatus,
} from "@/api/books";
import type { BookDisplay, BookStatus } from "@/@types/books";
import { mapBookRowToDisplay } from "@/lib/bookDisplayMapper";

const PAGE_SIZE = 10;

export const useUserBooks = (userId?: number) => {
  const queryClient = useQueryClient();
  const [offset, setOffset] = useState(0);

  // Fetch user's books with pagination
  const booksQuery = useQuery({
    queryKey: ["userBooks", userId, offset],
    queryFn: async () => {
      if (!userId) return { books: [], total: 0 };
      return await getUserBooks(userId, offset, PAGE_SIZE);
    },
    enabled: !!userId,
  });

  // Accumulate books as we load more
  const allBooks = useMemo(() => {
    if (!booksQuery.data) return [];

    // Get all cached pages from React Query
    const allPages: BookDisplay[] = [];
    let pageIndex = 0;

    while (true) {
      const cachedQuery = queryClient.getQueryData([
        "userBooks",
        userId,
        pageIndex * PAGE_SIZE,
      ]) as { books: any[]; total: number } | undefined;

      if (!cachedQuery) break;

      allPages.push(
        ...cachedQuery.books.map((book) => mapBookRowToDisplay(book)),
      );
      pageIndex++;
    }

    return allPages;
  }, [booksQuery.data, userId, queryClient]);

  const total = booksQuery.data?.total ?? 0;
  const hasMore = allBooks.length < total;

  // Load more function
  const loadMore = useCallback(() => {
    setOffset((prev) => prev + PAGE_SIZE);
  }, []);

  // Remove a book from user's list
  const removeMutation = useMutation({
    mutationFn: (bookId: number) => {
      if (!userId) throw new Error("UserId is required");
      return removeBookFromUserList(userId, bookId);
    },
    onSuccess: () => {
      setOffset(0);
      queryClient.invalidateQueries({ queryKey: ["userBooks"] });
    },
  });

  // Update book status (via dates)
  const updateStatusMutation = useMutation({
    mutationFn: ({
      bookId,
      status,
      currentBook,
    }: {
      bookId: number;
      status: BookStatus;
      currentBook: BookDisplay;
    }) => {
      if (!userId) throw new Error("UserId is required");
      return updateBookStatus(userId, bookId, status, currentBook);
    },
    onSuccess: () => {
      setOffset(0);
      queryClient.invalidateQueries({ queryKey: ["userBooks"] });
    },
  });

  const refetch = useCallback(() => {
    setOffset(0);
    return booksQuery.refetch();
  }, [booksQuery]);

  return {
    // Query
    books: allBooks,
    isLoading: booksQuery.isLoading && allBooks.length === 0,
    isError: booksQuery.isError,
    refetch,
    total,
    hasMore,
    loadMore,

    // Mutations
    removeBook: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};
