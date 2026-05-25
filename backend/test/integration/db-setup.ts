import { config as loadEnv } from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { category, keyword, user } from '../../src/db/schema';
import KEYWORDS_BY_CATEGORY from '../../src/keywords.json';

loadEnv({ path: '.env.test', override: true });

const CATEGORIES = [
  'unknown',
  'horreur',
  'romance',
  'aventure',
  'fantasy',
  'science-fiction',
];

const log = (msg: string) => console.log(`  [TEST DB] ${msg}`);

export default async function globalSetup() {
  const startedAt = Date.now();

  console.log('\n🌱 Setting up isolated PostgreSQL test database...');
  log(`Connecting to ${process.env.DATABASE_URL}`);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  log('Applying Drizzle migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  log('✅ Migrations applied');

  const existing = await db.select().from(category).limit(1);
  if (existing.length > 0) {
    log('⏭️  Database already seeded, skipping');
    await pool.end();
    log(`✨ Setup complete in ${Date.now() - startedAt}ms\n`);
    return;
  }

  log(`Seeding ${CATEGORIES.length} categories...`);
  for (const name of CATEGORIES) {
    await db.insert(category).values({ name });
  }
  log(`✅ ${CATEGORIES.length} categories seeded`);

  const allCategories = await db.select().from(category);
  const categoryMap = new Map(allCategories.map((c) => [c.name, c.id]));

  log('Seeding keywords from keywords.json...');
  let keywordCount = 0;
  for (const [catName, kws] of Object.entries(KEYWORDS_BY_CATEGORY)) {
    const categoryId = categoryMap.get(catName);
    if (!categoryId) continue;

    const uniqueKeywords = Array.from(
      new Set((kws as string[]).map((kw) => kw.trim().toLowerCase())),
    );

    for (const kw of uniqueKeywords) {
      await db.insert(keyword).values({ name: kw, categoryId });
      keywordCount++;
    }
  }
  log(`✅ ${keywordCount} keywords seeded`);

  log('Creating test user...');
  await db.insert(user).values({
    email: 'test@blablabook.test',
    password: 'hashed_test_password_placeholder',
    username: 'testuser',
  });
  log('✅ Test user created (email: test@blablabook.test)');

  await pool.end();
  log(`✨ Setup complete in ${Date.now() - startedAt}ms\n`);
}
