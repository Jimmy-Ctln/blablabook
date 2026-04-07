import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateBookDto {
  // Book title
  @IsString()
  @IsNotEmpty()
  name: string;

  // Cover ID or URL
  @IsString()
  @IsNotEmpty()
  coverUrl: string;

  // Author name
  @IsString()
  @IsNotEmpty()
  author: string;

  // Book description
  @IsString()
  @IsNotEmpty()
  description: string;

  // ISBN (unique)
  @IsString()
  @IsNotEmpty()
  isbn: string;

  // Publishing house
  @IsString()
  @IsNotEmpty()
  publishingHouse: string;

  // Publishing date (YYYY-MM-DD)
  @IsString()
  @IsNotEmpty()
  publishedAt: string; // Drizzle date type expects a string or Date

  // Categories (optional - from external API)
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
