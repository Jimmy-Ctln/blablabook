export class BookDto {
  id: number;
  name: string;
  author: string;
  cover_url?: string | null;
  description?: string | null;
  isbn: string;
  publishingHouse?: string | null;
  publishedAt?: string | null;
  categoryName: string;
  status?: string;
  comment?: string | null;
}
