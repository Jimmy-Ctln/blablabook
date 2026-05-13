import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: '978-0-7432-7356-5' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Un livre magnifique !' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  review_text: string;

  // Book fields — used to register the book if not yet in DB
  @ApiProperty({ example: 'The Great Gatsby' })
  @IsString()
  @IsNotEmpty()
  bookName: string;

  @ApiProperty({ example: 'https://covers.openlibrary.org/b/id/...' })
  @IsString()
  @IsNotEmpty()
  bookCoverUrl: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  @IsString()
  @IsNotEmpty()
  bookAuthor: string;

  @ApiProperty({ example: 'A classic novel...' })
  @IsString()
  @IsNotEmpty()
  bookDescription: string;

  @ApiProperty({ example: 'Scribner' })
  @IsString()
  @IsNotEmpty()
  bookPublishingHouse: string;

  @ApiProperty({ example: '1925-04-10' })
  @IsString()
  @IsNotEmpty()
  bookPublishedAt: string;

  @ApiProperty({ example: ['fiction', 'classic'], required: false, isArray: true, type: String })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bookCategories?: string[];
}
