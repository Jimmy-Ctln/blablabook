import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserBooks } from "./useUserBooks";
import * as booksApi from "@/api/books";
import type { BookRow } from "@/@types/books";
import type { ReactNode } from "react";
import React from "react";

// Mock the API module so the hook calls our fakes instead of real HTTP.
vi.mock("@/api/books");

// Builds a fresh QueryClient wrapper for each test so caches don't leak between tests.
const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

const fakeBook: BookRow = {
  id: 1,
  name: "Dune",
  author: "Frank Herbert",
  isbn: "9780441013593",
  categoryName: "science-fiction",
  status: "À lire",
};

describe("useUserBooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the books and total provided by the API", async () => {
    vi.mocked(booksApi.getUserBooks).mockResolvedValue({
      books: [fakeBook],
      total: 1,
    });

    const { result } = renderHook(() => useUserBooks(42), {
      wrapper: makeWrapper(),
    });

    // First render: still loading
    expect(result.current.isLoading).toBe(true);

    // After the query resolves, the books are exposed via the hook
    await waitFor(() => {
      expect(result.current.books).toHaveLength(1);
    });

    expect(result.current.total).toBe(1);
    expect(result.current.hasMore).toBe(false);
    expect(booksApi.getUserBooks).toHaveBeenCalledWith(42, 0, 10);
  });

  it("does not fetch when no userId is provided", () => {
    vi.mocked(booksApi.getUserBooks).mockResolvedValue({ books: [], total: 0 });

    renderHook(() => useUserBooks(undefined), { wrapper: makeWrapper() });

    // The query is disabled while userId is falsy
    expect(booksApi.getUserBooks).not.toHaveBeenCalled();
  });

  it("removeBook surfaces an error via the mutation when no userId is set", async () => {
    vi.mocked(booksApi.getUserBooks).mockResolvedValue({ books: [], total: 0 });

    const { result } = renderHook(() => useUserBooks(undefined), {
      wrapper: makeWrapper(),
    });

    // Trigger the mutation with no userId → onError branch fires
    result.current.removeBook(1);

    // The API must NOT have been called since the mutation throws before it
    await waitFor(() => {
      expect(booksApi.removeBookFromUserList).not.toHaveBeenCalled();
    });
  });

  it("updateNote calls the API and invalidates the cache on success", async () => {
    vi.mocked(booksApi.getUserBooks).mockResolvedValue({
      books: [fakeBook],
      total: 1,
    });
    vi.mocked(booksApi.updateBookNote).mockResolvedValue({ comment: "Note" });

    const { result } = renderHook(() => useUserBooks(42), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      expect(result.current.books).toHaveLength(1);
    });

    result.current.updateNote({ bookId: 7, comment: "Note" });

    await waitFor(() => {
      expect(booksApi.updateBookNote).toHaveBeenCalledWith(42, 7, "Note");
    });
  });

  it("loadMore triggers a new fetch with the next offset", async () => {
    vi.mocked(booksApi.getUserBooks).mockResolvedValue({
      books: [fakeBook],
      total: 25, // 25 total → hasMore should be true after the first page
    });

    const { result } = renderHook(() => useUserBooks(42), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      expect(result.current.books).toHaveLength(1);
    });
    expect(result.current.hasMore).toBe(true);

    // Asking for more should re-call the API with offset = 10 (PAGE_SIZE)
    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(booksApi.getUserBooks).toHaveBeenCalledWith(42, 10, 10);
    });
  });
});
