import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateBookDto {
  // Book title
  @IsString()
  @IsNotEmpty()
  name: string;

  // Cover ID or URL
  @IsString()
  @IsNotEmpty()
  coverId: string;

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

  // Categories (required - from external API)
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  categories: string[];
}
