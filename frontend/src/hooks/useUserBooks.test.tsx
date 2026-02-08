import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  describe,
  expect,
  it,
  vi,
  afterEach,
  beforeEach,
  type Mock,
} from "vitest";
import type { BookRow } from "@/@types/books";
import { useUserBooks } from "./useUserBooks";

vi.mock("@/api/books", () => ({
  getUserBooks: vi.fn(),
  removeBookFromUserList: vi.fn(),
  updateBookStatus: vi.fn(),
}));

const { getUserBooks, removeBookFromUserList, updateBookStatus } = await import(
  "@/api/books"
);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
};

afterEach(() => {
  vi.clearAllMocks();
});

/**
 * Factory function to create BookRow test data matching Drizzle-generated types.
 * Ensures all required fields are present with correct types.
 */
const createBookRow = (overrides?: Partial<BookRow>): BookRow => ({
  id: 1,
  name: "Book A",
  author: "Author A",
  isbn: "111",
  coverId: "a.jpg",
  description: "desc",
  publishingHouse: "PH",
  publishedAt: "2024-01-01",
  categories: ["Fiction"],
  readStart: null,
  readEnd: null,
  addedAt: new Date("2024-01-15"),
  status: "À lire",
  ...overrides,
});

describe("useUserBooks", () => {
  beforeEach(() => {
    (getUserBooks as Mock).mockResolvedValue([]);
  });

  it("fetches books when userId is provided", async () => {
    const books: BookRow[] = [createBookRow()];

    (getUserBooks as Mock).mockResolvedValueOnce(books);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useUserBooks(10), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.books).toEqual(books);
    expect(getUserBooks).toHaveBeenCalledWith(10);
  });

  it("does not fetch when userId is missing", () => {
    const { wrapper } = createWrapper();
    renderHook(() => useUserBooks(undefined), { wrapper });

    expect(getUserBooks).not.toHaveBeenCalled();
  });

  it("removes a book and invalidates the cache", async () => {
    (removeBookFromUserList as Mock).mockResolvedValueOnce([{ id: 5 }]);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useUserBooks(3), { wrapper });

    await act(async () => {
      result.current.removeBook(5);
    });

    await waitFor(() => {
      expect(removeBookFromUserList).toHaveBeenCalledWith(3, 5);
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["userBooks", 3],
      });
    });
  });

  it("updates book status via API", async () => {
    const updatedBook = createBookRow({
      id: 2,
      status: "Lu",
      readEnd: new Date("2024-02-15"),
    });
    (updateBookStatus as Mock).mockResolvedValueOnce(updatedBook);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const currentBook = createBookRow({ id: 2 });

    const { result } = renderHook(() => useUserBooks(4), { wrapper });

    await act(async () => {
      result.current.updateStatus({ bookId: 2, status: "Lu", currentBook });
    });

    await waitFor(() => {
      expect(updateBookStatus).toHaveBeenCalledWith(4, 2, "Lu", currentBook);
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["userBooks", 4],
      });
    });
  });
});
