import { useQuery } from "@tanstack/react-query";
import { getBookByIsbn } from "@/api/books";

export const useBookByIsbn = (isbn: string) =>
  useQuery({
    queryKey: ["db-book", isbn],
    queryFn: () => getBookByIsbn(isbn),
    enabled: !!isbn,
    staleTime: 1000 * 60 * 60,
  });
