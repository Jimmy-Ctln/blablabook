import { user } from 'src/db/schema';

export type UserSelect = typeof user.$inferSelect; // drizzle generated type for user with schema
export type UserInsert = typeof user.$inferInsert;
