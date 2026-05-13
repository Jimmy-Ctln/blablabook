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

@Injectable()
export class ReviewService {
  constructor(
    @Inject('DRIZZLE') private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getReviewsByBookId(bookId: number) {
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
      .leftJoin(schema.user, eq(schema.user.id, schema.review.userId))
      .where(eq(schema.review.bookId, bookId))
      .orderBy(sql`${schema.review.createdAt} DESC`);
  }

  async createReview(userId: number, dto: CreateReviewDto) {
    const [book] = await this.db
      .select({ id: schema.book.id })
      .from(schema.book)
      .where(eq(schema.book.id, dto.bookId));

    if (!book) throw new NotFoundException('Book not found');

    const [alreadyReviewed] = await this.db
      .select({ id: schema.review.id })
      .from(schema.review)
      .where(
        and(
          eq(schema.review.bookId, dto.bookId),
          eq(schema.review.userId, userId),
        ),
      );

    if (alreadyReviewed) {
      throw new ConflictException('You have already reviewed this book');
    }

    const [created] = await this.db
      .insert(schema.review)
      .values({
        bookId: dto.bookId,
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

    await this.db
      .delete(schema.review)
      .where(eq(schema.review.id, reviewId));

    return { id: reviewId };
  }
}
