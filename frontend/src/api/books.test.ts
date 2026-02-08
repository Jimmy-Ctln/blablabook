import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import type { BookRow } from "../@types/books";
import {
  getSearchBooks,
  getBooks,
  getUserBooks,
  addBookToUserList,
  removeBookFromUserList,
  updateBookStatus,
} from "./books";

const { mockApi } = vi.hoisted(() => ({
  mockApi: {
    get: vi.fn() as Mock,
    post: vi.fn() as Mock,
    delete: vi.fn() as Mock,
    patch: vi.fn() as Mock,
  },
}));

vi.mock("./axios", () => ({
  default: mockApi,
}));

/**
 * Factory function to create BookRow test data matching Drizzle types.
 */
const createBookRow = (overrides?: Partial<BookRow>): BookRow => ({
  id: 1,
  name: "Test Book",
  author: "Author",
  isbn: "123",
  coverId: "cover.jpg",
  description: "Description",
  publishingHouse: "House",
  publishedAt: "2024-01-01",
  categories: [],
  readStart: null,
  readEnd: null,
  addedAt: new Date(),
  status: "À lire",
  ...overrides,
});

describe("books api", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockApi.get.mockReset();
    mockApi.post.mockReset();
    mockApi.delete.mockReset();
    mockApi.patch.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds search params for getSearchBooks", async () => {
    const responseData = [{ id: 1 }];
    mockApi.get.mockResolvedValueOnce({ data: responseData });

    const params = {
      type: "searchText" as const,
      searchText: "hello",
      categoryName: "Fiction",
    };
    await getSearchBooks(params);

    expect(mockApi.get).toHaveBeenCalledWith("/books/search", {
      params: {
        type: "searchText",
        categoryName: "Fiction",
        searchText: "hello",
      },
    });
  });

  it("returns books list from getBooks", async () => {
    const responseData = [{ id: 1, name: "A" }];
    mockApi.get.mockResolvedValueOnce({ data: responseData });

    const result = await getBooks();

    expect(mockApi.get).toHaveBeenCalledWith("/books");
    expect(result).toEqual(responseData);
  });

  it("returns user books for getUserBooks", async () => {
    const responseData = [{ id: 2, name: "B" }];
    mockApi.get.mockResolvedValueOnce({ data: responseData });

    const result = await getUserBooks(7);

    expect(mockApi.get).toHaveBeenCalledWith("/books/library/7");
    expect(result).toEqual(responseData);
  });

  it("adds a book to user list", async () => {
    const dto = {
      name: "C",
      coverId: "cover.jpg",
      author: "Author C",
      description: "Description C",
      isbn: "9876543210",
      publishingHouse: "Publisher C",
      publishedAt: "2024-01-01",
      categories: ["Fiction"],
    };
    const created = createBookRow({ id: 3 });
    mockApi.post.mockResolvedValueOnce({ data: created });

    const result = await addBookToUserList(4, dto);

    expect(mockApi.post).toHaveBeenCalledWith("/books/library/4", dto);
    expect(result).toBe(created);
  });

  it("removes a book from user list", async () => {
    const deleted = [{ id: 8 }];
    mockApi.delete.mockResolvedValueOnce({ data: deleted });

    const result = await removeBookFromUserList(5, 8);

    expect(mockApi.delete).toHaveBeenCalledWith("/books/library/5/book/8");
    expect(result).toBe(deleted);
  });

  it("updates status to 'À lire' by resetting dates", async () => {
    mockApi.patch.mockResolvedValueOnce({ data: { id: 1 } });

    const book = createBookRow({
      readStart: new Date("2024-01-01"),
      readEnd: new Date("2024-02-01"),
    });
    await updateBookStatus(2, 1, "À lire", book);

    expect(mockApi.patch).toHaveBeenCalledWith(
      "/books/library/2/book/1/status",
      { readStart: null, readEnd: null },
    );
  });

  it("updates status to 'En cours' by setting start and clearing end", async () => {
    vi.setSystemTime(new Date("2024-03-01T00:00:00.000Z"));
    mockApi.patch.mockResolvedValueOnce({ data: { id: 1 } });

    const book = createBookRow({
      readStart: null,
      readEnd: null,
    });
    await updateBookStatus(2, 1, "En cours", book);

    expect(mockApi.patch).toHaveBeenCalledWith(
      "/books/library/2/book/1/status",
      { readStart: "2024-03-01T00:00:00.000Z", readEnd: null },
    );
  });

  it("updates status to 'Lu' by setting end date and preserving start", async () => {
    vi.setSystemTime(new Date("2024-03-02T00:00:00.000Z"));
    mockApi.patch.mockResolvedValueOnce({ data: { id: 1 } });

    const book = createBookRow({
      readStart: new Date("2024-03-01T00:00:00.000Z"),
      readEnd: null,
    });
    await updateBookStatus(2, 1, "Lu", book);

    expect(mockApi.patch).toHaveBeenCalledWith(
      "/books/library/2/book/1/status",
      {
        readStart: "2024-03-01T00:00:00.000Z",
        readEnd: "2024-03-02T00:00:00.000Z",
      },
    );
  });
});
