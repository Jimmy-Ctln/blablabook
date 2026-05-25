import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../src/db/schema';
import { BooksService } from '../../src/books/books.service';
import { CategoryService } from '../../src/category/category.service';

describe('findMatchedKeywords (integration with real database)', () => {
  let pool: Pool;
  let service: BooksService;

  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: 'DRIZZLE', useValue: db },
        { provide: CategoryService, useValue: {} },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterAll(async () => {
    await pool.end();
  });

  it('subject "ghostly" does NOT trigger the keyword "ghost" (regex word-boundary)', async () => {
    const matched = await service['findMatchedKeywords'](['ghostly']);
    expect(matched).toEqual([]);
  });

  it('subject "GHOST" matches the keyword "ghost" (case-insensitive via ~*)', async () => {
    const matched = await service['findMatchedKeywords'](['GHOST']);
    expect(matched.length).toBeGreaterThan(0);
  });

  it('subject with multiple distinct keywords returns all matches in a single query', async () => {
    const matched = await service['findMatchedKeywords'](['horror ghost vampire']);
    expect(matched.length).toBeGreaterThanOrEqual(3);
  });
});
