import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, afterEach, type Mock } from "vitest";
import type { ExternalBook } from "@/@types/externalBooks";
import type { BookRow } from "@/@types/books";
import { useAddBook } from "./useAddBook";

vi.mock("@/api/books", () => ({
  addBookToUserList: vi.fn(),
}));

vi.mock("@/api/externalBooks", () => ({
  getOpenLibIsbnData: vi.fn(),
  getOpenLibWorkData: vi.fn(),
}));

const { addBookToUserList } = await import("@/api/books");
const { getOpenLibIsbnData, getOpenLibWorkData } = await import(
  "@/api/externalBooks"
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

const baseExternalBook: ExternalBook = {
  key: "work-1",
  title: "Test Book",
  author: "Jane Doe",
  isbn: "1234567890",
  language: [{ key: "en" }],
  publishDate: "2023-05-01",
  cover: "cover.jpg",
  description: "A short description",
  publisher: "Test Publisher",
  categories: ["Fiction"],
};

/**
 * Factory function to create complete BookRow mock data matching Drizzle types.
 */
const createMockBookRow = (overrides?: Partial<BookRow>): BookRow => ({
  id: 1,
  name: "Test Book",
  author: "Jane Doe",
  isbn: "1234567890",
  coverId: "cover.jpg",
  description: "A short description",
  publishingHouse: "Test Publisher",
  publishedAt: "2023-05-01",
  categories: ["Fiction"],
  readStart: null,
  readEnd: null,
  addedAt: new Date(),
  status: "À lire",
  ...overrides,
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("useAddBook", () => {
  it("throws when userId is missing", async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useAddBook(), { wrapper });

    await expect(result.current.mutateAsync(baseExternalBook)).rejects.toThrow(
      "UserId is required",
    );
  });

  it("maps external book data and calls backend", async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useAddBook(7), { wrapper });
    const backendBook = createMockBookRow({ id: 1 });
    (addBookToUserList as Mock).mockResolvedValueOnce(backendBook);

    await result.current.mutateAsync(baseExternalBook);

    expect(addBookToUserList).toHaveBeenCalledWith(7, {
      name: "Test Book",
      author: "Jane Doe",
      isbn: "1234567890",
      coverId: "cover.jpg",
      description: "A short description",
      publishingHouse: "Test Publisher",
      publishedAt: "2023-05-01",
      categories: ["Fiction"],
    });
  });

  it("fetches missing description from OpenLibrary", async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useAddBook(5), { wrapper });
    (addBookToUserList as Mock).mockResolvedValueOnce(
      createMockBookRow({ id: 2 }),
    );

    (getOpenLibIsbnData as Mock).mockResolvedValueOnce({
      works: [{ key: "/works/OL123W" }],
    });
    (getOpenLibWorkData as Mock).mockResolvedValueOnce({
      description: { value: "Fetched description" },
    });

    const bookWithoutDescription: ExternalBook = {
      ...baseExternalBook,
      description: undefined,
      isbn: "0987654321",
    };

    await result.current.mutateAsync(bookWithoutDescription);

    expect(getOpenLibIsbnData).toHaveBeenCalledWith("0987654321");
    expect(getOpenLibWorkData).toHaveBeenCalledWith("/works/OL123W");
    expect(addBookToUserList).toHaveBeenCalledWith(
      5,
      expect.objectContaining({
        description: "Fetched description",
      }),
    );
  });

  it("invalidates user books query on success", async () => {
    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useAddBook(9), { wrapper });
    (addBookToUserList as Mock).mockResolvedValueOnce(
      createMockBookRow({ id: 3 }),
    );

    await result.current.mutateAsync(baseExternalBook);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["userBooks", 9],
        refetchType: "active",
      });
    });
  });
});
