import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  book,
  list,
  listBook,
  category,
  keyword,
  bookKeyword,
} from '../db/schema';
import * as schema from '../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateBookDto } from './dto/create-book.dto';
import { eq, and, desc, sql, count, inArray } from 'drizzle-orm';
import { BookSelect, ListBookSelect } from './types/books';
import { CategoryService } from '../category/category.service';
import { BookDto } from './dto/book.dto';
/**
 * BooksService encapsulates CRUD-like operations around books and user lists.
 * It reads/writes through Drizzle ORM and computes transient fields like status.
 */
@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @Inject('DRIZZLE') private readonly db: NodePgDatabase<typeof schema>,
    private readonly categoryService: CategoryService,
  ) {}
  private async getUserList(userId: number) {
    const [userList] = await this.db
      .select()
      .from(list)
      .where(eq(list.userId, userId));
    if (!userList) {
      throw new HttpException('User list not found', HttpStatus.NOT_FOUND);
    }
    return userList;
  }

  private async getOrCreateUserList(userId: number) {
    const [existing] = await this.db
      .select()
      .from(list)
      .where(eq(list.userId, userId));
    if (existing) return existing;
    const [created] = await this.db.insert(list).values({ userId }).returning();
    return created;
  }

  /**
   * Compute reading status without using nested ternaries to satisfy Sonar.
   */
  private computeStatus(
    readStart?: Date | string | null,
    readEnd?: Date | string | null,
  ): 'Lu' | 'En cours' | 'À lire' {
    if (readEnd) return 'Lu';
    if (readStart) return 'En cours';
    return 'À lire';
  }
  /**
   * Get all books from the `book` table.
   * @returns Array of persisted book records
   */
  async findByIsbn(isbn: string) {
    const [found] = await this.db
      .select({
        id: book.id,
        isbn: book.isbn,
        name: book.name,
        categoryName: category.name,
      })
      .from(book)
      .innerJoin(category, eq(book.categoryId, category.id))
      .where(eq(book.isbn, isbn));
    return found ?? null;
  }

  async createBook(dto: CreateBookDto): Promise<{ id: number }> {
    return this.insertBook(dto);
  }

  private normalizeSubjects(categories?: string[]): string[] {
    return (categories ?? []).map((c) => c.trim()).filter((c) => c.length > 0);
  }

  private async findMatchedKeywords(subjects: string[]) {
    if (subjects.length === 0) return [];
    return this.db
      .select({ keywordId: keyword.id, categoryId: category.id })
      .from(keyword)
      .innerJoin(category, eq(category.id, keyword.categoryId))
      .where(sql`${subjects.join(' ')} ~* ('\\m' || ${keyword.name} || '\\M')`);
  }

  private pickWinningCategory(
    matchedKeywords: Array<{ categoryId: number }>,
  ): number {
    if (matchedKeywords.length === 0) return 1;
    const counts = matchedKeywords.reduce<Record<number, number>>(
      (acc, { categoryId: cId }) => {
        acc[cId] = (acc[cId] ?? 0) + 1;
        return acc;
      },
      {},
    );
    const [winnerId] = Object.entries(counts).sort(([, a], [, b]) => b - a)[0];
    return Number(winnerId);
  }

  private async linkBookToKeywords(
    bookId: number,
    matchedKeywords: Array<{ keywordId: number }>,
  ): Promise<void> {
    if (matchedKeywords.length === 0) return;
    try {
      await this.db
        .insert(bookKeyword)
        .values(
          matchedKeywords.map((kw) => ({ bookId, keywordId: kw.keywordId })),
        );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (!errorMsg.toLowerCase().includes('unique')) throw err;
    }
  }

  private async insertBook(dto: CreateBookDto): Promise<BookSelect> {
    const subjects = this.normalizeSubjects(dto.categories);
    const matchedKeywords = await this.findMatchedKeywords(subjects);
    const categoryId = this.pickWinningCategory(matchedKeywords);

    const [inserted] = await this.db
      .insert(book)
      .values({
        name: dto.name,
        cover_url: dto.coverUrl,
        author: dto.author,
        description: dto.description,
        isbn: dto.isbn,
        publishingHouse: dto.publishingHouse,
        publishedAt: dto.publishedAt,
        categoryId,
      })
      .returning();

    await this.linkBookToKeywords(inserted.id, matchedKeywords);

    return inserted;
  }

  async findAllBooks(
    categories?: string[],
  ): Promise<Record<string, BookDto[]>> {
    const normalizedCategories = (categories ?? [])
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const baseQuery = this.db
      .select({
        id: book.id,
        name: book.name,
        author: book.author,
        cover_url: book.cover_url,
        description: book.description,
        isbn: book.isbn,
        publishingHouse: book.publishingHouse,
        publishedAt: book.publishedAt,
        categoryName: category.name,
      })
      .from(book)
      .innerJoin(category, eq(book.categoryId, category.id));

    const books =
      normalizedCategories.length === 0
        ? await baseQuery
        : await baseQuery.where(inArray(category.name, normalizedCategories));

    return books.reduce<Record<string, BookDto[]>>((acc, currentBook) => {
      const categoryName = (
        currentBook.categoryName || 'Unknown'
      ).toLowerCase();

      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(currentBook);
      return acc;
    }, {});
  }

  /**
   * Get randoms Books from the `book` table with limit.
   * @returns Array of persisted book records with category name
   */
  async getRandomBooks(limit: number = 10) {
    return await this.db
      .select({
        id: book.id,
        name: book.name,
        author: book.author,
        cover_url: book.cover_url,
        description: book.description,
        isbn: book.isbn,
        publishingHouse: book.publishingHouse,
        publishedAt: book.publishedAt,
        categoryId: book.categoryId,
        categoryName: category.name,
      })
      .from(book)
      .innerJoin(category, eq(book.categoryId, category.id))
      .orderBy(sql`RANDOM()`)
      .limit(limit);
  }

  /**
   * Get all books belonging to a specific user's list, enriched with a computed
   * `status` field based on `readStart`/`readEnd` dates and ordered by `addedAt`.
   * Supports pagination with offset and limit.
   * @param userId Target user id
   * @param offset Number of books to skip (default: 0)
   * @param limit Number of books to return (default: 10)
   * @returns Object with books array and total count
   */
  async findUserBooks(
    userId: number,
    offset: number = 0,
    limit: number = 10,
  ): Promise<{ books: BookDto[]; total: number }> {
    // Get total count of user's books
    const countResult = await this.db
      .select({ count: count() })
      .from(listBook)
      .innerJoin(list, eq(list.id, listBook.listId))
      .where(eq(list.userId, userId));

    const total = countResult[0]?.count || 0;

    // Get paginated books
    const rows = await this.db
      .select({
        id: book.id,
        name: book.name,
        cover_url: book.cover_url,
        author: book.author,
        description: book.description,
        isbn: book.isbn,
        publishingHouse: book.publishingHouse,
        publishedAt: book.publishedAt,
        categoryName: category.name,

        // Keep dates so we can compute status
        readStart: listBook.readStart,
        readEnd: listBook.readEnd,
        addedAt: listBook.addedAt,
        comment: listBook.comment,
      })
      .from(listBook)
      .innerJoin(book, eq(book.id, listBook.bookId))
      .innerJoin(list, eq(list.id, listBook.listId))
      .innerJoin(category, eq(book.categoryId, category.id))
      .where(eq(list.userId, userId))
      .orderBy(desc(listBook.addedAt))
      .offset(offset)
      .limit(limit);

    // Compute status and attach categories for each book
    const booksWithStatus = rows.map((b) => ({
      id: b.id,
      name: b.name,
      cover_url: b.cover_url,
      author: b.author,
      description: b.description,
      isbn: b.isbn,
      publishingHouse: b.publishingHouse,
      publishedAt: b.publishedAt,
      categoryName: b.categoryName,
      status: this.computeStatus(b.readStart, b.readEnd),
      readStart: b.readStart,
      readEnd: b.readEnd,
      comment: b.comment,
    }));

    return {
      books: booksWithStatus as BookDto[],
      total,
    };
  }

  /**
   * Add a book to a user's list. If the book does not exist (by ISBN), it is
   * created first. If the user's list does not exist, it is created as well.
   * @param userId Target user id
   * @param createBookDto Payload from frontend (already normalized)
   * @returns The (existing or newly created) book record
   */
  async addToUserList(
    userId: number,
    createBookDto: CreateBookDto,
  ): Promise<BookSelect> {
    try {
      const found = await this.db
        .select()
        .from(book)
        .where(eq(book.isbn, createBookDto.isbn));

      let existingBook = found[0];

      if (!existingBook) {
        existingBook = await this.insertBook(createBookDto);
      }

      const userList = await this.getOrCreateUserList(userId);

      const [alreadyLinked] = await this.db
        .select({ id: listBook.id })
        .from(listBook)
        .where(
          and(
            eq(listBook.bookId, existingBook.id),
            eq(listBook.listId, userList.id),
          ),
        );

      if (alreadyLinked) {
        throw new HttpException(
          'Book already in user library',
          HttpStatus.CONFLICT,
        );
      }

      await this.db
        .insert(listBook)
        .values({
          bookId: existingBook.id,
          listId: userList.id,
        })
        .returning();

      return existingBook;
    } catch (err) {
      if (err instanceof HttpException) throw err;

      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        'Failed to add book to user list',
        error.stack || error,
      );
      throw new HttpException(
        {
          message: 'Unable to add book to user list',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Remove a book from the user's list by unlinking it in the join table.
   * Returns the deleted join rows or null if the user has no list yet.
   * @param userId Target user id
   * @param bookId Book to unlink
   */
  async removeFromUserList(
    userId: number,
    bookId: number,
  ): Promise<ListBookSelect[]> {
    const userList = await this.getUserList(userId);

    return this.db
      .delete(listBook)
      .where(and(eq(listBook.bookId, bookId), eq(listBook.listId, userList.id)))
      .returning();
  }

  /**
   * Update the reading dates (readStart, readEnd) for a book in a user's list.
   * This allows changing the computed status without storing status directly.
   * @param userId Target user id
   * @param bookId Target book id
   * @param readStart New readStart date (null to unset)
   * @param readEnd New readEnd date (null to unset)
   * @returns The updated book with computed status
   */
  async updateBookStatus(
    userId: number,
    bookId: number,
    readStart: Date | null,
    readEnd: Date | null,
  ): Promise<BookSelect> {
    try {
      const userList = await this.getUserList(userId);

      // Update the listBook entry with new dates
      const updated = await this.db
        .update(listBook)
        .set({
          readStart,
          readEnd,
          updatedAt: new Date(),
        })
        .where(
          and(eq(listBook.bookId, bookId), eq(listBook.listId, userList.id)),
        )
        .returning();

      if (!updated || updated.length === 0) {
        throw new HttpException(
          'Book not found in user list',
          HttpStatus.NOT_FOUND,
        );
      }

      // Fetch the full book data to return
      const bookData = await this.db
        .select()
        .from(book)
        .where(eq(book.id, bookId));

      if (!bookData || bookData.length === 0) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      // Return book with computed status
      return {
        ...(bookData[0] as unknown as Record<string, unknown>),
        readStart: updated[0].readStart,
        readEnd: updated[0].readEnd,
        status: this.computeStatus(updated[0].readStart, updated[0].readEnd),
      } as unknown as BookSelect;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error('Failed to update book dates', error.stack || error);
      throw new HttpException(
        {
          message: 'Unable to update book dates',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBookNote(
    userId: number,
    bookId: number,
    comment: string | null,
  ): Promise<{ comment: string | null }> {
    const userList = await this.getUserList(userId);

    const updated = await this.db
      .update(listBook)
      .set({ comment, updatedAt: new Date() })
      .where(and(eq(listBook.bookId, bookId), eq(listBook.listId, userList.id)))
      .returning();

    if (!updated || updated.length === 0) {
      throw new HttpException(
        'Book not found in user list',
        HttpStatus.NOT_FOUND,
      );
    }

    return { comment: updated[0].comment };
  }
}
