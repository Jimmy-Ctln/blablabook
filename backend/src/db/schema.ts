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
  image: varchar(),
  role: userRoleEnum().default('USER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const list = pgTable('list', {
  id: serial().primaryKey(),
  name: varchar({ length: 150 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: integer('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
});

export const book = pgTable('book', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  coverId: varchar('cover_id', { length: 255 }).notNull(),
  author: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  isbn: varchar('isbn', { length: 255 }).notNull().unique(),
  publishingHouse: varchar('publishing_house', { length: 255 }).notNull(),
  publishedAt: date('published_at').notNull(),
});

export const category = pgTable('category', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
  isActive: boolean('is_active').default(true),
});

export const bookCategory = pgTable(
  'book_category',
  {
    id: serial().primaryKey(),
    categoryId: integer('category_id')
      .references(() => category.id)
      .notNull(),
    bookId: integer('book_id')
      .references(() => book.id)
      .notNull(),
  },
  // prevent duplicate category for book
  (t) => [unique('unique_category_book').on(t.bookId, t.categoryId)],
);

export const userCategory = pgTable(
  'user_category',
  {
    id: serial().primaryKey(),
    categoryId: integer('category_id')
      .references(() => category.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
  },
  // prevent duplicate category for user
  (t) => [unique('unique_category_user').on(t.userId, t.categoryId)],
);

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
  review: text(),
  note: integer().notNull(),
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
  token: varchar().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  userId: integer('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
});
