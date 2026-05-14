import {
  pgTable,
  serial,
  timestamp,
  pgEnum,
  varchar,
  integer,
  date,
  text,
  boolean,
  unique,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('role', ['USER', 'ADMIN']);

export const user = pgTable('user', {
  id: serial().primaryKey(),
  email: varchar().unique().notNull(),
  password: varchar().notNull(),
  username: varchar({ length: 50 }).notNull().unique(),
  avatar_url: varchar('avatar_url', { length: 500 }),
  role: userRoleEnum().default('USER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const list = pgTable(
  'list',
  {
    id: serial().primaryKey(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    userId: integer('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (t) => [unique('unique_user_list').on(t.userId)],
);

export const book = pgTable('book', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  cover_url: varchar('cover_url', { length: 500 }),
  author: varchar({ length: 255 }).notNull(),
  description: text(),
  isbn: varchar('isbn', { length: 255 }).notNull().unique(),
  publishingHouse: varchar('publishing_house', { length: 255 }),
  publishedAt: date('published_at'),
  categoryId: integer('category_id')
    .references(() => category.id)
    .default(1) // ← Default category “Unknown” (id: 1)
    .notNull(),
});

export const keyword = pgTable('keyword', {
  id: serial().primaryKey().unique(),
  name: varchar({ length: 100 }).notNull().unique(),
  categoryId: integer('category_id')
    .references(() => category.id)
    .notNull(),
});

export const category = pgTable('category', {
  id: serial().primaryKey().unique(),
  name: varchar({ length: 100 }).notNull().unique(),
  isActive: boolean('is_active').default(true),
});

export const listBook = pgTable(
  'list_book',
  {
    id: serial().primaryKey(),
    comment: text(),
    readStart: timestamp('read_start'),
    readEnd: timestamp('read_end'),
    addedAt: timestamp('added_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    bookId: integer('book_id')
      .references(() => book.id)
      .notNull(),
    listId: integer('list_id')
      .references(() => list.id)
      .notNull(),
  },
  (t) => [
    // add constraint for prevent duplicate book on list
    unique('unique_book_list').on(t.listId, t.bookId),
  ],
);

export const review = pgTable('review', {
  id: serial().primaryKey(),
  review_text: text(),
  rating: integer().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  bookId: integer('book_id')
    .references(() => book.id)
    .notNull(),
  userId: integer('user_id').references(() => user.id, {
    onDelete: 'set null',
  }),
});

export const refreshToken = pgTable('refresh_token', {
  id: serial().primaryKey(),
  refresh_token: varchar().notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  userId: integer('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
});

export const bookKeyword = pgTable(
  'book_keyword',
  {
    id: serial().primaryKey(),
    bookId: integer('book_id')
      .references(() => book.id, { onDelete: 'cascade' })
      .notNull(),
    keywordId: integer('keyword_id')
      .references(() => keyword.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    // prevent duplicate keyword for book
    unique('unique_keyword_book').on(t.bookId, t.keywordId),
  ],
);
