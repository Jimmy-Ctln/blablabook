import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import * as schema from '@/db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, sql } from 'drizzle-orm';
import { CreateReviewDto } from './dto/create-review.dto';
import { BooksService } from '@/books/books.service';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('DRIZZLE') private readonly db: NodePgDatabase<typeof schema>,
    private readonly booksService: BooksService,
  ) {}

  async getReviewsByIsbn(isbn: string) {
    return this.db
      .select({
        id: schema.review.id,
        review_text: schema.review.review_text,
        rating: schema.review.rating,
        createdAt: schema.review.createdAt,
        userId: schema.review.userId,
        username: schema.user.username,
        avatar_url: schema.user.avatar_url,
      })
      .from(schema.review)
      .innerJoin(schema.book, eq(schema.book.id, schema.review.bookId))
      .leftJoin(schema.user, eq(schema.user.id, schema.review.userId))
      .where(eq(schema.book.isbn, isbn))
      .orderBy(sql`${schema.review.createdAt} DESC`);
  }

  async createReview(userId: number, dto: CreateReviewDto) {
    // Find the book by ISBN, or create it if it doesn't exist yet
    const existing = await this.booksService.findByIsbn(dto.isbn);
    const bookId = existing?.id ?? (await this.booksService.createBook({
      name: dto.bookName,
      coverUrl: dto.bookCoverUrl,
      author: dto.bookAuthor,
      description: dto.bookDescription,
      isbn: dto.isbn,
      publishingHouse: dto.bookPublishingHouse,
      publishedAt: dto.bookPublishedAt,
      categories: dto.bookCategories,
    })).id;

    const [alreadyReviewed] = await this.db
      .select({ id: schema.review.id })
      .from(schema.review)
      .where(
        and(
          eq(schema.review.bookId, bookId),
          eq(schema.review.userId, userId),
        ),
      );

    if (alreadyReviewed) {
      throw new ConflictException('You have already reviewed this book');
    }

    const [created] = await this.db
      .insert(schema.review)
      .values({
        bookId,
        userId,
        rating: dto.rating,
        review_text: dto.review_text,
      })
      .returning();

    const [withUser] = await this.db
      .select({
        id: schema.review.id,
        review_text: schema.review.review_text,
        rating: schema.review.rating,
        createdAt: schema.review.createdAt,
        userId: schema.review.userId,
        username: schema.user.username,
        avatar_url: schema.user.avatar_url,
      })
      .from(schema.review)
      .leftJoin(schema.user, eq(schema.user.id, schema.review.userId))
      .where(eq(schema.review.id, created.id));

    return withUser;
  }

  async deleteReview(reviewId: number, userId: number) {
    const [existing] = await this.db
      .select({ id: schema.review.id, userId: schema.review.userId })
      .from(schema.review)
      .where(eq(schema.review.id, reviewId));

    if (!existing) throw new NotFoundException('Review not found');
    if (existing.userId !== userId)
      throw new ForbiddenException('You can only delete your own reviews');

    await this.db.delete(schema.review).where(eq(schema.review.id, reviewId));

    return { id: reviewId };
  }
}
