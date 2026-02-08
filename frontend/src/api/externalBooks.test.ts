import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { searchExternalBooks } from "./externalBooks";

const { mockExternalApi } = vi.hoisted(() => ({
  mockExternalApi: { get: vi.fn() as Mock },
}));

vi.mock("./axiosExternal", () => ({
  default: mockExternalApi,
}));

vi.mock("../lib/utils", () => ({
  getRandomQuery: vi.fn(() => "random query"),
}));

describe("searchExternalBooks", () => {
  beforeEach(() => {
    mockExternalApi.get.mockReset();
  });

  it("searches by text and fetches edition details", async () => {
    mockExternalApi.get
      .mockResolvedValueOnce({
        data: {
          docs: [
            {
              key: "/works/OL1W",
              title: "Test Book",
              author_name: ["Author A"],
              edition_key: ["OL1234M"],
              subject: ["Fiction", "Drama"],
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          key: "/books/OL1234M",
          title: "Test Book",
          isbn_13: ["9781234567890"],
          covers: [12345],
          authors: [{ name: "Author A" }],
          publishers: ["Publisher X"],
          publish_date: "2020",
        },
      });

    const result = await searchExternalBooks({
      type: "searchText",
      searchText: "Test Book",
    });

    expect(mockExternalApi.get).toHaveBeenNthCalledWith(1, "/search.json", {
      params: {
        q: "Test Book",
        limit: 20,
        fields: "key,title,author_name,edition_key,subject",
      },
    });
    expect(mockExternalApi.get).toHaveBeenNthCalledWith(
      2,
      "/books/OL1234M.json"
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      title: "Test Book",
      author: "Author A",
      isbn: "9781234567890",
      cover: "https://covers.openlibrary.org/b/id/12345-M.jpg",
      categories: ["Fiction", "Drama"],
    });
  });

  it("searches by category", async () => {
    mockExternalApi.get
      .mockResolvedValueOnce({
        data: {
          docs: [
            {
              key: "/works/OL2W",
              title: "Science Book",
              author_name: ["Scientist"],
              edition_key: ["OL5678M"],
              subject: ["Science"],
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          key: "/books/OL5678M",
          title: "Science Book",
          isbn_13: ["9780987654321"],
          covers: [67890],
          authors: [{ name: "Scientist" }],
          publishers: ["Science Press"],
          publish_date: "2019",
        },
      });

    const result = await searchExternalBooks({
      type: "category",
      categoryName: "Science",
    });

    expect(mockExternalApi.get).toHaveBeenNthCalledWith(1, "/search.json", {
      params: {
        q: "Science",
        limit: 20,
        fields: "key,title,author_name,edition_key,subject",
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Science Book");
  });

  it("uses random query for random type", async () => {
    mockExternalApi.get.mockResolvedValueOnce({ data: { docs: [] } });

    await searchExternalBooks({ type: "random" });

    expect(mockExternalApi.get).toHaveBeenCalledWith("/search.json", {
      params: {
        q: "random query",
        limit: 20,
        fields: "key,title,author_name,edition_key,subject",
      },
    });
  });

  it("skips works without edition_key", async () => {
    mockExternalApi.get.mockResolvedValueOnce({
      data: {
        docs: [
          {
            key: "/works/OL3W",
            title: "No Editions",
            author_name: ["Author B"],
            edition_key: [],
          },
        ],
      },
    });

    const result = await searchExternalBooks({
      type: "searchText",
      searchText: "query",
    });

    expect(result).toHaveLength(0);
  });

  it("skips editions without isbn_13", async () => {
    mockExternalApi.get
      .mockResolvedValueOnce({
        data: {
          docs: [
            {
              key: "/works/OL4W",
              title: "No ISBN",
              author_name: ["Author C"],
              edition_key: ["OL9999M"],
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          key: "/books/OL9999M",
          title: "No ISBN",
          isbn_13: [],
          covers: [],
        },
      });

    const result = await searchExternalBooks({
      type: "searchText",
      searchText: "query",
    });

    expect(result).toHaveLength(0);
  });

  it("uses default cover when covers are missing", async () => {
    mockExternalApi.get
      .mockResolvedValueOnce({
        data: {
          docs: [
            {
              key: "/works/OL5W",
              title: "Book No Cover",
              author_name: ["Author D"],
              edition_key: ["OL1111M"],
              subject: ["Fiction"],
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          key: "/books/OL1111M",
          title: "Book No Cover",
          isbn_13: ["9781111111111"],
          covers: undefined,
          authors: [{ name: "Author D" }],
          publishers: ["Pub"],
          publish_date: "2021",
        },
      });

    const result = await searchExternalBooks({
      type: "searchText",
      searchText: "Book No Cover",
    });

    expect(result).toHaveLength(1);
    expect(result[0].cover).toBe("/default-book-cover.png");
  });
});
