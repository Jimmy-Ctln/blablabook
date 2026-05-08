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
  UseGuards,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

/**
 * REST controller for book-related routes.
 * Delegates business logic to `BooksService` and handles parameter parsing.
 */
@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * GET /books
   * Returns all books persisted in the `book` table (not user-specific).
   */
  @Get()
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Books retrieved successfully' })
  async getAllBooks(@Query('category') category?: string | string[]) {
    const categories = Array.isArray(category)
      ? category
      : category
        ? [category]
        : undefined;
    return this.booksService.findAllBooks(categories);
  }

  /**
   * GET /books/random
   * Returns randoms books persisted in the `book` table (not user-specific).
   */
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @Get('random')
  async getRandomBooks(@Query('limit') limit: string = '10') {
    return this.booksService.getRandomBooks(parseInt(limit));
  }

  /**
   * GET /books/library/:userId
   * Returns all books linked to the user's list, with a computed `status`.
   * Supports pagination with offset and limit query parameters.
   */
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @Get('library/:userId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all books for a user' })
  @ApiResponse({
    status: 200,
    description: 'User books retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getUserBooks(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const authenticatedUserId = request['user']?.sub;
    if (!authenticatedUserId) {
      throw new BadRequestException('User not found in request');
    }
    if (authenticatedUserId !== userId) {
      throw new ForbiddenException('You can only access your own library');
    }
    return this.booksService.findUserBooks(userId, offset, limit);
  }

  /**
   * POST /books/library/:userId
   * Adds a book to the user's list, creating the book and/or list if needed.
   */
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Post('library/:userId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Add a book to a user library' })
  @ApiResponse({ status: 201, description: 'Book added to user library' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async addBookToUserList(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createBookDto: CreateBookDto,
    @Req() request: Request,
  ) {
    const authenticatedUserId = request['user']?.sub;
    if (!authenticatedUserId) {
      throw new BadRequestException('User not found in request');
    }
    if (authenticatedUserId !== userId) {
      throw new ForbiddenException(
        'You can only add books to your own library',
      );
    }
    return this.booksService.addToUserList(userId, createBookDto);
  }

  /**
   * DELETE /books/library/:userId/book/:bookId
   * Removes the link between a book and the user's list.
   */
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @Delete('library/:userId/book/:bookId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Remove a book from a user library' })
  @ApiResponse({ status: 200, description: 'Book removed from user library' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async removeBookFromUserList(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Req() request: Request,
  ) {
    const authenticatedUserId = request['user']?.sub;
    if (!authenticatedUserId) {
      throw new BadRequestException('User not found in request');
    }
    if (authenticatedUserId !== userId) {
      throw new ForbiddenException(
        'You can only remove books from your own library',
      );
    }
    return this.booksService.removeFromUserList(userId, bookId);
  }

  /**
   * PATCH /books/library/:userId/book/:bookId/status
   * Updates the reading dates (readStart, readEnd) for a book in the user's list.
   * This allows changing the computed status based on dates.
   */
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @UseGuards(AuthGuard)
  @Patch('library/:userId/book/:bookId/status')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update reading status for a book in user library' })
  @ApiResponse({ status: 200, description: 'Book status updated successfully' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async updateBookStatusDates(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() updateDatesDto: UpdateBookStatusDto,
    @Req() request: Request,
  ) {
    const authenticatedUserId = request['user']?.sub;
    if (!authenticatedUserId) {
      throw new BadRequestException('User not found in request');
    }
    if (authenticatedUserId !== userId) {
      throw new ForbiddenException(
        'You can only update your own reading status',
      );
    }
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
}
