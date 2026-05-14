import type { BookRow } from "@/@types/books";
import type { ExternalBook } from "@/@types/externalBooks";
import type { BookDisplay } from "@/@types/books";

// Maps a BookRow (internal) to a BookDisplay
export function mapBookRowToDisplay(book: BookRow): BookDisplay {
  const resolvedCover = book.cover_url ?? undefined;

  return {
    id: book.id.toString(),
    internalId: book.id,
    name: book.name,
    author: book.author,
    cover_url: resolvedCover,
    cover: resolvedCover,
    isbn: book.isbn,
    categoryName: book.categoryName,
    categories: book.categoryName ? [book.categoryName] : [],
    publishDate: book.publishedAt ?? undefined,
    publisher: book.publishingHouse ?? undefined,
    status: book.status,
    readStart: book.readStart,
    readEnd: book.readEnd,
    addedAt: book.addedAt,
    comment: book.comment,
  };
}

// Maps an ExternalBook (external) to a BookDisplay
export function mapExternalBookToDisplay(book: ExternalBook): BookDisplay {
  return {
    id: book.key,
    name: book.title,
    author: book.author,
    cover_url: book.cover,
    cover: book.cover,
    isbn: book.isbn,
    categories: book.categories ?? [],
    publishDate: book.publishDate,
    publisher: book.publisher,
  };
}
