import { IsNotEmpty, IsString, IsArray, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    example: 'The Great Gatsby',
    description: 'Book title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'name must be shorter than 255 characters' })
  name: string;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: 'Book cover image URL or ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  coverUrl?: string;

  @ApiProperty({
    example: 'F. Scott Fitzgerald',
    description: 'Book author name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'author must be shorter than 255 characters' })
  author: string;

  @ApiProperty({
    example: 'A classic novel set in the Jazz Age',
    description: 'Book description or synopsis',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'description must be shorter than 5000 characters' })
  description?: string;

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
    required: false,
  })
  @IsOptional()
  @IsString()
  publishingHouse?: string;

  @ApiProperty({
    example: '1925-04-10',
    description: 'Publication date in YYYY-MM-DD format',
    required: false,
  })
  @IsOptional()
  @IsString()
  publishedAt?: string;

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
