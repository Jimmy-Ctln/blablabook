// Frontend client for our internal backend Book APIs.
// Wraps axios calls and provides typed responses.
import type { GetExternalBooksParams } from "../@types/externalBooks";
import type { CreateBookDto, BookRow } from "../@types/books";
import api from "./axios";

// -----------------------------
// Internal API functions
// -----------------------------

/**
 * Search endpoint on the backend (if applicable).
 * Accepts optional filters and forwards them as query params.
 */
export function getSearchBooks(params: GetExternalBooksParams) {
  const query: Record<string, string> = {};
  if (params.type) query.type = params.type;
  if (params.categoryName) query.categoryName = params.categoryName;
  if (params.searchText) query.searchText = params.searchText;

  return api.get(`/books/search`, { params: query });
}

/** Get all books persisted in the backend `book` table. */
export const getBooks = async (): Promise<BookRow[]> => {
  const response = await api.get<BookRow[]>("/books");
  return response.data;
};

/** Get all books from a specific user's library (with computed status). */
export const getUserBooks = async (userId: number): Promise<BookRow[]> => {
  const response = await api.get<BookRow[]>(`/books/library/${userId}`);
  return response.data;
};

/**
 * Fetch a random selection of books from the database.
 * @param limit - Number of random books to retrieve (default: 10)
 * @returns Promise resolving to an array of randomly selected books
 */
export const getRandomBooks = async (limit: number): Promise<BookRow[]> => {
  const response = await api.get<BookRow[]>(`/books/random?limit=${limit}`);
  return response.data;
};

/**
 * Add a book to a user's list. If the book doesn't exist yet, the backend
 * will create it first, then link it to the user's list.
 */
export const addBookToUserList = async (
  userId: number,
  bookData: CreateBookDto,
): Promise<BookRow> => {
  const response = await api.post<BookRow>(
    `/books/library/${userId}`,
    bookData,
  );
  return response.data;
};

/** Remove a book from a user's list by unlinking it on the backend. */
export const removeBookFromUserList = async (
  userId: number,
  bookId: number,
): Promise<{ id: number }[]> => {
  const response = await api.delete<{ id: number }[]>(
    `/books/library/${userId}/book/${bookId}`,
  );
  return response.data;
};

/**
 * Update the reading dates of a book in a user's library to reflect status change.
 * Status is calculated from dates:
 * - "À lire": readStart and readEnd are null
 * - "En cours": readStart is set, readEnd is null
 * - "Lu": readEnd is set
 */
export const updateBookStatus = async (
  userId: number,
  bookId: number,
  status: "Lu" | "En cours" | "À lire",
  currentBook: BookRow,
): Promise<BookRow> => {
  const now = new Date().toISOString();

  let readStart: string | null = null;
  let readEnd: string | null = null;

  // Helper function to safely convert potential date strings to ISO
  const formatToISO = (
    date: string | Date | null | undefined,
  ): string | null => {
    if (!date) return null;
    return typeof date === "string" ? date : date.toISOString();
  };

  if (status === "À lire") {
    // Reset to "to read" state
    readStart = null;
    readEnd = null;
  } else if (status === "En cours") {
    // Start reading: set start date if not already set, clear end date
    readStart = currentBook.readStart
      ? formatToISO(currentBook.readStart)
      : now;
    readEnd = null;
  } else if (status === "Lu") {
    // "Lu": Mark as finished
    // Keep existing readStart or set to now if never started
    readStart = currentBook.readStart
      ? formatToISO(currentBook.readStart)
      : now;
    readEnd = now;
  }

  const response = await api.patch<BookRow>(
    `/books/library/${userId}/book/${bookId}/status`,
    { readStart, readEnd },
  );
  return response.data;
};
