export type BookStatus = "Lu" | "En cours" | "À lire";

export interface CreateBookDto {
  name: string;
  coverId: string;
  author: string;
  description: string;
  isbn: string;
  publishingHouse: string;
  publishedAt: string; // YYYY-MM-DD
  categories: string[];
}

/**
 * Drizzle-generated type matching backend BookSelect.
 * This ensures frontend mocks and data align exactly with backend schema.
 */
export interface BookRow {
  id: number;
  name: string;
  coverId: string;
  author: string;
  description: string;
  isbn: string;
  publishingHouse: string;
  publishedAt: string; // date format from Drizzle
  status: BookStatus;
  categories?: string[];
  readStart?: Date | null;
  readEnd?: Date | null;
  addedAt?: Date;
}

// /**
//  * @deprecated Use BookRow instead for strict typing with Drizzle-generated types.
//  */
// export interface Book extends BookRow {
//   listName?: string;
// }

// BookDisplay: unified display type for the front end
// Allows all components to use the same type, regardless of the source (internal or external)
export interface BookDisplay {
  id: string;
  internalId?: number | undefined; // Only internal book
  name: string;
  description?: string;
  author: string;
  cover: string;
  isbn: string;
  publisher: string;
  publishDate: string;
  status?: string; //The status is optionnal because externals books don't have status
  categories: string[];
  readStart?: Date | null;
  readEnd?: Date | null;
  addedAt?: Date;
}
