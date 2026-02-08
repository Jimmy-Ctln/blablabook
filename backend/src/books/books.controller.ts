import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * REST controller for book-related routes.
 * Delegates business logic to `BooksService` and handles parameter parsing.
 */
@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * GET /books
   * Returns all books persisted in the `book` table (not user-specific).
   */
  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Books retrieved successfully' })
  async getAllBooks() {
    return this.booksService.findAllBooks();
  }

  /**
   * GET /books/random
   * Returns randoms books persisted in the `book` table (not user-specific).
   */
  @Get('random')
  async getRandomBooks(@Query('limit') limit: string = '10') {
    return this.booksService.getRandomBooks(parseInt(limit));
  }

  /**
   * GET /books/library/:userId
   * Returns all books linked to the user's list, with a computed `status`.
   */
  @Get('library/:userId')
  @ApiOperation({ summary: 'Get all books for a user' })
  @ApiResponse({
    status: 200,
    description: 'User books retrieved successfully',
  })
  async getUserBooks(@Param('userId', ParseIntPipe) userId: number) {
    return this.booksService.findUserBooks(userId);
  }

  /**
   * POST /books/library/:userId
   * Adds a book to the user's list, creating the book and/or list if needed.
   */
  @Post('library/:userId')
  @ApiOperation({ summary: 'Add a book to a user library' })
  @ApiResponse({ status: 201, description: 'Book added to user library' })
  async addBookToUserList(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createBookDto: CreateBookDto,
  ) {
    return this.booksService.addToUserList(userId, createBookDto);
  }

  /**
   * DELETE /books/library/:userId/book/:bookId
   * Removes the link between a book and the user's list.
   */
  @Delete('library/:userId/book/:bookId')
  @ApiOperation({ summary: 'Remove a book from a user library' })
  @ApiResponse({ status: 200, description: 'Book removed from user library' })
  async removeBookFromUserList(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.booksService.removeFromUserList(userId, bookId);
  }

  /**
   * PATCH /books/library/:userId/book/:bookId/status
   * Updates the reading dates (readStart, readEnd) for a book in the user's list.
   * This allows changing the computed status based on dates.
   */
  @Patch('library/:userId/book/:bookId/status')
  @ApiOperation({ summary: 'Update reading status for a book in user library' })
  @ApiResponse({ status: 200, description: 'Book status updated successfully' })
  async updateBookStatusDates(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() updateDatesDto: UpdateBookStatusDto,
  ) {
    const readStart = updateDatesDto.readStart
      ? new Date(updateDatesDto.readStart)
      : null;
    const readEnd = updateDatesDto.readEnd
      ? new Date(updateDatesDto.readEnd)
      : null;

    return this.booksService.updateBookStatus(
      userId,
      bookId,
      readStart,
      readEnd,
    );
  }

  /**
   * GET /books/:bookId/categories
   * Get all categories for a specific book
   */
  @Get(':bookId/categories')
  @ApiOperation({ summary: 'Get all categories for a book' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async getCategoriesForBook(
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<{ id: number; name: string }[]> {
    return this.booksService.getCategoriesForBook(bookId);
  }
}
