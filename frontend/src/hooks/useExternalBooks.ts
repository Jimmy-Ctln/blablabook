import { useQuery } from "@tanstack/react-query";
import type {
  ExternalBook,
  UseExternalBooksOptions,
} from "@/@types/externalBooks";
import { searchExternalBooks } from "@/api/externalBooks";

export const useExternalBooks = (options: UseExternalBooksOptions) => {
  const { mode, param, enabled: enabledOption, ...queryOptions } = options;
  let queryKey: any[] = [];
  let queryFn: () => Promise<ExternalBook[]>;
  let enabled = enabledOption !== undefined ? enabledOption : true;

  if (mode === "search") {
    queryKey = ["externalBooks", mode, param];
    queryFn = () =>
      searchExternalBooks({ type: "searchText", searchText: param! });
    if (enabledOption === undefined) {
      enabled = !!param && param.length > 0;
    }
  } else if (mode === "random") {
    queryKey = ["random-external-books", mode];
    queryFn = () => searchExternalBooks({ type: "random" });
  } else if (mode === "category") {
    queryKey = ["by-category-external-books", mode, param];
    queryFn = () =>
      searchExternalBooks({ type: "category", categoryName: param! });
  } else {
    enabled = false;
    queryFn = async () => [];
  }

  return useQuery<ExternalBook[]>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5,
    enabled,
    ...queryOptions,
  });
};
