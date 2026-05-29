import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import request from 'supertest';
import { App } from 'supertest/types';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../src/db/schema';
import { AppModule } from '../../src/app.module';
import { AuthGuard } from '../../src/auth/auth.guard';

describe('POST /books/library/:userId (functional - full HTTP chain)', () => {
  let app: INestApplication<App>;
  let pool: Pool;
  let db: NodePgDatabase<typeof schema>;
  let testUserId: number;

  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema });

    const [testUser] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, 'test@blablabook.test'));
    testUserId = testUser.id;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: import('@nestjs/common').ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { sub: testUserId, userRole: 'USER' };
          return true;
        },
      })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await pool.end();
  });

  it('adds a book with categorization and returns 201', async () => {
    const uniqueIsbn = `func-test-${Date.now()}`;

    const response = await request(app.getHttpServer())
      .post(`/books/library/${testUserId}`)
      .set('Content-Type', 'application/json')
      .send({
        name: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        isbn: uniqueIsbn,
        coverUrl: 'https://example.test/cover.jpg',
        description: 'Epic quest to destroy a magical ring.',
        publishingHouse: 'Allen & Unwin',
        publishedAt: '1954-07-29',
        categories: ['fantasy', 'magic', 'dragons', 'quest'],
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      isbn: uniqueIsbn,
    });

    const [insertedBook] = await db
      .select()
      .from(schema.book)
      .where(eq(schema.book.isbn, uniqueIsbn));
    expect(insertedBook).toBeDefined();

    const [fantasyCategory] = await db
      .select()
      .from(schema.category)
      .where(eq(schema.category.name, 'fantasy'));
    expect(insertedBook.categoryId).toBe(fantasyCategory.id);
  });

  it('falls back to the "unknown" category when no subject matches any keyword', async () => {
    const uniqueIsbn = `func-test-unknown-${Date.now()}`;

    await request(app.getHttpServer())
      .post(`/books/library/${testUserId}`)
      .set('Content-Type', 'application/json')
      .send({
        name: 'Modern Accounting Practices',
        author: 'Jane Doe',
        isbn: uniqueIsbn,
        // Subjects unrelated to any seeded keyword (no horror/romance/fantasy/etc.)
        categories: ['mathematics', 'accounting'],
      })
      .expect(201);

    const [insertedBook] = await db
      .select()
      .from(schema.book)
      .where(eq(schema.book.isbn, uniqueIsbn));
    expect(insertedBook).toBeDefined();

    const [unknownCategory] = await db
      .select()
      .from(schema.category)
      .where(eq(schema.category.name, 'unknown'));
    expect(insertedBook.categoryId).toBe(unknownCategory.id);
  });
});
