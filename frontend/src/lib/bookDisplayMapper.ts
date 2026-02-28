import type { BookRow } from "@/@types/books";
import type { ExternalBook } from "@/@types/externalBooks";
import type { BookDisplay } from "@/@types/books";

// Maps a BookRow (internal) to a BookDisplay
export function mapBookRowToDisplay(book: BookRow): BookDisplay {
  return {
    id: book.id.toString(),
    internalId: book.id, //Need to save original id of the bookRow
    name: book.name,
    author: book.author,
    cover: book.coverId ?? "",
    isbn: book.isbn,
    categories: book.categories ?? [],
    publishDate: book.publishedAt,
    publisher: book.publishingHouse,
    status: book.status,
    readStart: book.readStart,
    readEnd: book.readEnd,
    addedAt: book.addedAt,
  };
}

// Maps an ExternalBook (external) to a BookDisplay
export function mapExternalBookToDisplay(book: ExternalBook): BookDisplay {
  return {
    id: book.key,
    name: book.title,
    author: book.author,
    cover: book.cover ?? "",
    isbn: book.isbn,
    categories: book.categories ?? [],
    publishDate: book.publishDate ?? "",
    publisher: book.publisher ?? "",
  };
}
