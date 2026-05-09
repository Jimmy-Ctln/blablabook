import { book, listBook } from '@/db/schema';

// drizzle generated type for book with schema
export type BookSelect = typeof book.$inferSelect;
export type ListBookSelect = typeof listBook.$inferSelect;
