import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    example: 'The Great Gatsby',
    description: 'Book title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: 'Book cover image URL or ID',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  coverUrl: string;

  @ApiProperty({
    example: 'F. Scott Fitzgerald',
    description: 'Book author name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    example: 'A classic novel set in the Jazz Age',
    description: 'Book description or synopsis',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '978-0-7432-7356-5',
    description: 'ISBN - International Standard Book Number (13 digits)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({
    example: 'Scribner',
    description: 'Publishing house or publisher name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  publishingHouse: string;

  @ApiProperty({
    example: '1925-04-10',
    description: 'Publication date in YYYY-MM-DD format',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  publishedAt: string;

  @ApiProperty({
    example: ['fiction', 'classic'],
    description: 'Book categories (optional)',
    required: false,
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
