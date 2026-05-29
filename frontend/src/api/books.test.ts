import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUserBooks,
  getRandomBooks,
  updateBookStatus,
  removeBookFromUserList,
} from "./books";
import api from "./axios";
import type { BookDisplay } from "@/@types/books";

// We mock the axios client so no real HTTP request leaves the test.
// Each API function under test calls api.get / api.post / api.patch / api.delete.
vi.mock("./axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("api/books", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUserBooks calls the library endpoint with offset and limit", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { books: [], total: 0 },
    });

    await getUserBooks(42, 10, 20);

    expect(api.get).toHaveBeenCalledWith("/books/library/42", {
      params: { offset: 10, limit: 20 },
    });
  });

  it("getRandomBooks returns an empty array when the API returns nothing", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: null });

    const result = await getRandomBooks(5);

    expect(result).toEqual([]);
  });

  it("removeBookFromUserList sends a DELETE to the correct URL", async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({ data: [{ id: 7 }] });

    await removeBookFromUserList(42, 7);

    expect(api.delete).toHaveBeenCalledWith("/books/library/42/book/7");
  });

  it("updateBookStatus sends null dates when status is 'À lire'", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({ data: {} });

    const currentBook = {
      id: "1",
      name: "Dune",
      author: "Herbert",
      isbn: "9780441013593",
      readStart: new Date("2024-01-01"),
      readEnd: null,
    } as BookDisplay;

    await updateBookStatus(42, 7, "À lire", currentBook);

    // For "À lire", both readStart and readEnd must be reset to null
    expect(api.patch).toHaveBeenCalledWith(
      "/books/library/42/book/7/status",
      { readStart: null, readEnd: null },
    );
  });

  it("updateBookStatus keeps an existing readStart when moving to 'En cours'", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({ data: {} });

    const start = new Date("2024-01-01T00:00:00.000Z");
    const currentBook = {
      id: "1",
      name: "Dune",
      author: "Herbert",
      isbn: "9780441013593",
      readStart: start,
      readEnd: null,
    } as BookDisplay;

    await updateBookStatus(42, 7, "En cours", currentBook);

    // Existing start date must be preserved (converted to ISO), end stays null
    expect(api.patch).toHaveBeenCalledWith(
      "/books/library/42/book/7/status",
      { readStart: start.toISOString(), readEnd: null },
    );
  });

  it("getBookByIsbn returns null when the backend returns nothing", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: null });

    const { getBookByIsbn } = await import("./books");
    const result = await getBookByIsbn("0000000000000");

    expect(result).toBeNull();
    expect(api.get).toHaveBeenCalledWith("/books/isbn/0000000000000");
  });

  it("getBooks forwards each category as a separate 'category' query param", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: {} });

    const { getBooks } = await import("./books");
    await getBooks(["romance", "fantasy"]);

    const callArgs = vi.mocked(api.get).mock.calls[0];
    expect(callArgs[0]).toBe("/books");
    // URLSearchParams supports duplicate keys → backend expects "category=romance&category=fantasy"
    const params = (callArgs[1] as { params: URLSearchParams }).params;
    expect(params.getAll("category")).toEqual(["romance", "fantasy"]);
  });

  it("addBookToUserList sends a POST with the book payload", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: 1 } });

    const { addBookToUserList } = await import("./books");
    const bookData = {
      name: "Dune",
      author: "Herbert",
      isbn: "9780441013593",
      categories: ["science-fiction"],
    };

    await addBookToUserList(42, bookData);

    expect(api.post).toHaveBeenCalledWith("/books/library/42", bookData);
  });

  it("updateBookStatus sends BOTH readStart and readEnd when status is 'Lu'", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({ data: {} });

    // No existing readStart → the helper must set one to "now" itself
    const currentBook = {
      id: "1",
      name: "Dune",
      author: "Herbert",
      isbn: "9780441013593",
      readStart: null,
      readEnd: null,
    } as BookDisplay;

    await updateBookStatus(42, 7, "Lu", currentBook);

    const body = vi.mocked(api.patch).mock.calls[0][1] as {
      readStart: string;
      readEnd: string;
    };
    // Both dates must be ISO strings (not null) when marking a book as "Lu"
    expect(typeof body.readStart).toBe("string");
    expect(typeof body.readEnd).toBe("string");
  });

  it("updateBookNote PATCHes the note endpoint with the comment", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({
      data: { comment: "À relire absolument" },
    });

    const { updateBookNote } = await import("./books");
    const result = await updateBookNote(42, 7, "À relire absolument");

    expect(api.patch).toHaveBeenCalledWith(
      "/books/library/42/book/7/note",
      { comment: "À relire absolument" },
    );
    expect(result.comment).toBe("À relire absolument");
  });
});
