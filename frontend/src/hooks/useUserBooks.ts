/**
 * Custom hook that encapsulates all user book operations:
 * - Fetching user's books
 * - Removing a book from user's library
 * - Updating book status (via dates)
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserBooks,
  removeBookFromUserList,
  updateBookStatus,
} from "@/api/books";
import type { BookRow, BookStatus } from "@/@types/books";

export const useUserBooks = (userId?: number) => {
  const queryClient = useQueryClient();

  // Fetch user's books
  const booksQuery = useQuery({
    queryKey: ["userBooks", userId],
    queryFn: () => getUserBooks(userId!),
    enabled: !!userId,
  });

  // Remove a book from user's list
  const removeMutation = useMutation({
    mutationFn: (bookId: number) => {
      if (!userId) throw new Error("UserId is required");
      return removeBookFromUserList(userId, bookId);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userBooks", userId] }),
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
      currentBook: BookRow;
    }) => {
      if (!userId) throw new Error("UserId is required");
      return updateBookStatus(userId, bookId, status, currentBook);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userBooks", userId] }),
  });

  return {
    // Query
    books: Array.isArray(booksQuery.data) ? booksQuery.data : [],
    isLoading: booksQuery.isLoading,
    isError: booksQuery.isError,
    refetch: booksQuery.refetch,

    // Mutations
    removeBook: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};
