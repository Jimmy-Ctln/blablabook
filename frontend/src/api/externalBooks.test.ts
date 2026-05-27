import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchExternalBooks, getFullExternalBook } from "./externalBooks";
import externalApi from "./axiosExternal";

// We mock the external axios client so no real call to OpenLibrary is made.
vi.mock("./axiosExternal", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("api/externalBooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("searchExternalBooks throws when type=searchText but searchText is missing", async () => {
    await expect(
      searchExternalBooks({ type: "searchText" }),
    ).rejects.toThrow("Missing search text");
  });

  it("searchExternalBooks builds an ExternalBook from the first edition with an ISBN-13", async () => {
    // Response with one work that has two editions:
    //  - first edition has no ISBN-13 (only ISBN-10)  → must be skipped
    //  - second edition has an ISBN-13                → must be used
    vi.mocked(externalApi.get).mockResolvedValueOnce({
      data: {
        numFound: 1,
        docs: [
          {
            key: "/works/OL1W",
            title: "Dune",
            author_name: ["Frank Herbert"],
            first_publish_year: 1965,
            cover_i: 111,
            subject: ["science-fiction"],
            editions: {
              numFound: 2,
              docs: [
                { key: "/books/OL_short", title: "Dune (court)", isbn: ["0441013597"] },
                {
                  key: "/books/OL_ok",
                  title: "Dune (longue)",
                  isbn: ["9780441013593"],
                  covers: [999],
                },
              ],
            },
          },
        ],
      },
    });

    const result = await searchExternalBooks({ type: "searchText", searchText: "Dune" });

    expect(result.numFound).toBe(1);
    expect(result.books).toHaveLength(1);
    expect(result.books[0]).toMatchObject({
      isbn: "9780441013593",
      title: "Dune (longue)",
      author: "Frank Herbert",
      categories: ["science-fiction"],
    });
    // The edition's own cover (999) takes precedence over the work cover (111)
    expect(result.books[0].cover).toContain("999");
  });

  it("searchExternalBooks throws when type=category but categoryName is missing", async () => {
    await expect(
      searchExternalBooks({ type: "category" }),
    ).rejects.toThrow("Missing category name");
  });

  it("searchExternalBooks returns no books when no edition has an ISBN-13", async () => {
    vi.mocked(externalApi.get).mockResolvedValueOnce({
      data: {
        numFound: 1,
        docs: [
          {
            key: "/works/OL1W",
            title: "Old book",
            author_name: ["Old Author"],
            editions: {
              numFound: 1,
              // Only an ISBN-10 → the helper must skip it
              docs: [{ key: "/books/OL_short", title: "Old book", isbn: ["0441013597"] }],
            },
          },
        ],
      },
    });

    const result = await searchExternalBooks({ type: "searchText", searchText: "Old" });

    expect(result.books).toHaveLength(0);
    expect(result.numFound).toBe(1);
  });

  it("getFullExternalBook handles a description returned as an object { value }", async () => {
    // Edition data
    vi.mocked(externalApi.get).mockResolvedValueOnce({
      data: {
        title: "Dune",
        works: [{ key: "/works/OL1W" }],
        authors: [{ key: "/authors/OL2A" }],
      },
    });
    // Work data with description as an object — must be unwrapped to its .value string
    vi.mocked(externalApi.get).mockResolvedValueOnce({
      data: { description: { value: "Description longue OL" }, subjects: [] },
    });
    // Author
    vi.mocked(externalApi.get).mockResolvedValueOnce({
      data: { name: "Frank Herbert" },
    });

    const result = await getFullExternalBook("9780441013593");

    expect(result.description).toBe("Description longue OL");
  });

  it("getFullExternalBook merges data from the 3 endpoints", async () => {
    // 1) ISBN endpoint: edition data (title, work key, author key)
    vi.mocked(externalApi.get).mockResolvedValueOnce({
      data: {
        title: "Dune",
        covers: [12345],
        works: [{ key: "/works/OL1W" }],
        authors: [{ key: "/authors/OL2A" }],
        publishers: ["Robert Laffont"],
        publish_date: "2020",
        number_of_pages: 800,
        languages: [{ key: "/languages/fre" }],
      },
    });
    // 2) Work endpoint: description + subjects
    vi.mocked(externalApi.get).mockResolvedValueOnce({
      data: { description: "Une saga galactique", subjects: ["science-fiction"] },
    });
    // 3) Author endpoint: name
    vi.mocked(externalApi.get).mockResolvedValueOnce({
      data: { name: "Frank Herbert" },
    });

    const result = await getFullExternalBook("9780441013593");

    expect(result).toMatchObject({
      isbn: "9780441013593",
      title: "Dune",
      authors: ["Frank Herbert"],
      description: "Une saga galactique",
      publisher: "Robert Laffont",
      pages: 800,
      language: "fre",
      categories: ["science-fiction"],
    });
  });
});
