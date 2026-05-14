export class BookDto {
  id: number;
  name: string;
  author: string;
  cover_url: string;
  description: string;
  isbn: string;
  publishingHouse: string;
  publishedAt: string;
  categoryName: string;
  status?: string;
  comment?: string | null;
}
