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
  readStart?: Date | null;
  readEnd?: Date | null;
  addedAt?: Date;
  status?: BookStatus;
  categories?: string[];
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
  key: string;
  title: string;
  author: string;
  cover: string;
  isbn?: string;
  categories?: string[];
}
