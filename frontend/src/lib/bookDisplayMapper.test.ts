import { describe, it, expect } from "vitest";
import {
  mapBookRowToDisplay,
  mapExternalBookToDisplay,
} from "./bookDisplayMapper";
import type { BookRow } from "@/@types/books";
import type { ExternalBook } from "@/@types/externalBooks";

describe("bookDisplayMapper", () => {
  // Helper: minimal BookRow with a fixed category
  const makeBookRow = (categoryName: BookRow["categoryName"]): BookRow => ({
    id: 1,
    name: "Dune",
    author: "Frank Herbert",
    isbn: "9780441013593",
    categoryName,
    status: "À lire",
  });

  it("wraps the backend categoryName into the categories array", () => {
    const book = makeBookRow("fantasy");

    const result = mapBookRowToDisplay(book);

    expect(result.categoryName).toBe("fantasy");
    expect(result.categories).toEqual(["fantasy"]);
  });

  it("keeps 'unknown' as a category when the backend could not classify the book", () => {
    const book = makeBookRow("unknown");

    const result = mapBookRowToDisplay(book);

    expect(result.categories).toEqual(["unknown"]);
  });

  it("preserves the categories list when mapping an external book", () => {
    const externalBook: ExternalBook = {
      key: "OL123W",
      title: "Foundation",
      author: "Isaac Asimov",
      isbn: "9780553293357",
      categories: ["science-fiction", "classic"],
    };

    const result = mapExternalBookToDisplay(externalBook);

    expect(result.categories).toEqual(["science-fiction", "classic"]);
  });
});
