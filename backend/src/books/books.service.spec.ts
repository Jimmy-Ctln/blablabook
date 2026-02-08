import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { CategoryService } from '../category/category.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { book, category, list, listBook } from '../db/schema';

type BookRow = typeof book.$inferSelect;
type CategoryRow = typeof category.$inferSelect;
type ListRow = typeof list.$inferSelect;
type ListBookRow = typeof listBook.$inferSelect;
type UserBookRow = BookRow & {
  readStart: Date | null;
  readEnd: Date | null;
  addedAt: Date;
};
type UserBook = BookRow & { status: string; categories: string[] };

/**
 * INTERFACE DE MOCK POUR DRIZZLE
 * Drizzle utilise un "Fluent API" (chaînage de méthodes).
 * Chaque méthode (select, from, where, etc.) doit retourner l'objet lui-même (this)
 * pour que la chaîne ne soit pas brisée.
 */
interface DrizzleMock {
  select: jest.Mock;
  from: jest.Mock;
  where: jest.Mock;
  orderBy: jest.Mock;
  innerJoin: jest.Mock;
  insert: jest.Mock;
  values: jest.Mock;
  returning: jest.Mock;
  delete: jest.Mock;
  update: jest.Mock;
  set: jest.Mock;
  onConflictDoNothing: jest.Mock;
  // execute et returning sont les "terminaisons" qui renvoient la promesse de données
  execute: jest.Mock;
}

interface CategoryServiceMock {
  findOrCreateByName: jest.Mock<
    Promise<Pick<CategoryRow, 'id' | 'name'>>,
    [string]
  >;
}

const makeBook = (overrides: Partial<BookRow> = {}): BookRow => ({
  id: 1,
  name: 'Book',
  coverId: 'cover-id',
  author: 'Author',
  description: 'Description',
  isbn: '1234567890',
  publishingHouse: 'House',
  publishedAt: '2023-01-01',
  ...overrides,
});

const makeCategory = (overrides: Partial<CategoryRow> = {}): CategoryRow => ({
  id: 1,
  name: 'Fiction',
  isActive: true,
  ...overrides,
});

const makeList = (overrides: Partial<ListRow> = {}): ListRow => ({
  id: 1,
  name: 'My List',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 1,
  ...overrides,
});

const makeListBook = (overrides: Partial<ListBookRow> = {}): ListBookRow => ({
  id: 1,
  comment: null,
  readStart: null,
  readEnd: null,
  addedAt: new Date(),
  updatedAt: new Date(),
  bookId: 1,
  listId: 1,
  ...overrides,
});

describe('BooksService', () => {
  let service: BooksService;
  let mockDb: DrizzleMock;
  let mockCategoryService: CategoryServiceMock;

  beforeEach(async () => {
    // Mock database operations
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([]),
      delete: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      onConflictDoNothing: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue([]),
    };

    // Mock category service
    mockCategoryService = {
      findOrCreateByName: jest.fn<
        Promise<Pick<CategoryRow, 'id' | 'name'>>,
        [string]
      >(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: 'DRIZZLE',
          useValue: mockDb,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllBooks', () => {
    it('should return all books from the database', async () => {
      const mockBooks: (BookRow & { categories: string[] })[] = [
        {
          ...makeBook({
            id: 1,
            name: 'Book 1',
            author: 'Author 1',
            isbn: '1234567890',
          }),
          categories: [],
        },
        {
          ...makeBook({
            id: 2,
            name: 'Book 2',
            author: 'Author 2',
            isbn: '0987654321',
          }),
          categories: [],
        },
      ];

      // Mock the full chain for getCategoriesForBook
      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              orderBy: jest.fn().mockReturnValue({
                execute: jest.fn().mockResolvedValue([]),
              }),
            }),
          }),
        }),
      });

      // Also mock for the initial books fetch
      const originalSelect = mockDb.select;
      mockDb.select = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue(
            mockBooks.map((b) => {
              const { ...book } = b;
              return book;
            }),
          ),
        })
        .mockReturnValue(originalSelect());

      const result = await service.findAllBooks();

      expect(result).toEqual(mockBooks);
      expect(mockDb.select).toHaveBeenCalled();
    });
  });

  describe('findUserBooks', () => {
    it('should return user books with computed status and categories', async () => {
      const userId = 1;
      const mockRows: UserBookRow[] = [
        {
          ...makeBook({
            id: 1,
            name: 'Book 1',
            author: 'Author 1',
            isbn: '1234567890',
            coverId: 'cover1',
            description: 'Description 1',
            publishingHouse: 'House 1',
            publishedAt: '2023-01-01',
          }),
          readStart: new Date('2024-01-01'),
          readEnd: null,
          addedAt: new Date('2024-01-01'),
        },
      ];

      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnValue({
            innerJoin: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockResolvedValue(mockRows),
              }),
            }),
          }),
        }),
      } as DrizzleMock);

      // Mock getCategoriesForBook
      jest
        .spyOn(service, 'getCategoriesForBook')
        .mockResolvedValue([{ id: 1, name: 'Fiction' }]);

      const result = await service.findUserBooks(userId);

      expect(result).toHaveLength(1);
      const first = result[0] as UserBook;
      expect(first.status).toBe('En cours');
      expect(first.categories).toEqual(['Fiction']);
    });

    it('should compute status as "À lire" when no dates are set', async () => {
      const userId = 1;
      const mockRows: UserBookRow[] = [
        {
          ...makeBook({
            id: 1,
            name: 'Book 1',
            author: 'Author 1',
            isbn: '1234567890',
            coverId: 'cover1',
            description: 'Description 1',
            publishingHouse: 'House 1',
            publishedAt: '2023-01-01',
          }),
          readStart: null,
          readEnd: null,
          addedAt: new Date('2024-01-01'),
        },
      ];

      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnValue({
            innerJoin: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockResolvedValue(mockRows),
              }),
            }),
          }),
        }),
      } as DrizzleMock);

      jest.spyOn(service, 'getCategoriesForBook').mockResolvedValue([]);

      const result = await service.findUserBooks(userId);

      const first = result[0] as UserBook;
      expect(first.status).toBe('À lire');
    });

    it('should compute status as "Lu" when readEnd is set', async () => {
      const userId = 1;
      const mockRows: UserBookRow[] = [
        {
          ...makeBook({
            id: 1,
            name: 'Book 1',
            author: 'Author 1',
            isbn: '1234567890',
            coverId: 'cover1',
            description: 'Description 1',
            publishingHouse: 'House 1',
            publishedAt: '2023-01-01',
          }),
          readStart: new Date('2024-01-01'),
          readEnd: new Date('2024-02-01'),
          addedAt: new Date('2024-01-01'),
        },
      ];

      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnValue({
            innerJoin: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockResolvedValue(mockRows),
              }),
            }),
          }),
        }),
      } as DrizzleMock);

      jest.spyOn(service, 'getCategoriesForBook').mockResolvedValue([]);

      const result = await service.findUserBooks(userId);

      const first = result[0] as UserBook;
      expect(first.status).toBe('Lu');
    });
  });

  describe('addToUserList', () => {
    const userId = 1;
    const createBookDto = {
      name: 'New Book',
      author: 'New Author',
      isbn: '1234567890',
      coverId: 'cover123',
      description: 'A new book',
      publishingHouse: 'New House',
      publishedAt: '2023-01-01',
      categories: ['Fiction', 'Adventure'],
    };

    it('should create a new book if it does not exist', async () => {
      const newBook: BookRow = makeBook({
        id: 1,
        name: createBookDto.name,
        author: createBookDto.author,
        isbn: createBookDto.isbn,
        coverId: createBookDto.coverId,
        description: createBookDto.description,
        publishingHouse: createBookDto.publishingHouse,
        publishedAt: createBookDto.publishedAt,
      });

      // Mock book not found
      mockDb.select = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([]),
          }),
        } as DrizzleMock)
        // Mock list found
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([makeList({ id: 1, userId })]),
          }),
        } as DrizzleMock);

      // Mock book insert and listBook insert
      mockDb.insert = jest
        .fn()
        .mockReturnValueOnce({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([newBook]),
          }),
        } as DrizzleMock)
        .mockReturnValueOnce({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([]),
          }),
        } as DrizzleMock);

      jest
        .spyOn(service, 'assignCategoriesFromNames')
        .mockResolvedValue(undefined);

      const result = await service.addToUserList(userId, createBookDto);

      expect(result).toEqual(newBook);
    });

    it('should use existing book if it exists by ISBN', async () => {
      const existingBook: BookRow = makeBook({
        id: 1,
        name: createBookDto.name,
        author: createBookDto.author,
        isbn: createBookDto.isbn,
        coverId: createBookDto.coverId,
        description: createBookDto.description,
        publishingHouse: createBookDto.publishingHouse,
        publishedAt: createBookDto.publishedAt,
      });

      // Mock book found
      mockDb.select = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([existingBook]),
          }),
        } as DrizzleMock)
        // Mock list found
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([makeList({ id: 1, userId })]),
          }),
        } as DrizzleMock);

      // Mock listBook insert
      mockDb.insert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      } as DrizzleMock);

      jest
        .spyOn(service, 'assignCategoriesFromNames')
        .mockResolvedValue(undefined);

      const result = await service.addToUserList(userId, createBookDto);

      expect(result).toEqual(existingBook);
    });

    it('should create user list if it does not exist', async () => {
      const newBook: BookRow = makeBook({
        id: 1,
        name: createBookDto.name,
        author: createBookDto.author,
        isbn: createBookDto.isbn,
        coverId: createBookDto.coverId,
        description: createBookDto.description,
        publishingHouse: createBookDto.publishingHouse,
        publishedAt: createBookDto.publishedAt,
      });
      const newList: ListRow = makeList({ id: 1, name: 'My List', userId });

      // Mock book not found, then list not found
      mockDb.select = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([]),
          }),
        } as DrizzleMock)
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([]),
          }),
        } as DrizzleMock);

      // Mock book insert and list insert
      mockDb.insert = jest
        .fn()
        .mockReturnValueOnce({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([newBook]),
          }),
        } as DrizzleMock)
        .mockReturnValueOnce({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([newList]),
          }),
        } as DrizzleMock)
        .mockReturnValueOnce({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([]),
          }),
        } as DrizzleMock);

      jest
        .spyOn(service, 'assignCategoriesFromNames')
        .mockResolvedValue(undefined);

      const result = await service.addToUserList(userId, createBookDto);

      expect(result).toEqual(newBook);
    });
  });

  describe('removeFromUserList', () => {
    it('should remove book from user list', async () => {
      const userId = 1;
      const bookId = 1;
      const deletedRow: ListBookRow = makeListBook({ bookId, listId: 1 });

      // Mock list found
      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([makeList({ id: 1, userId })]),
        }),
      } as DrizzleMock);

      // Mock delete
      mockDb.delete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([deletedRow]),
        }),
      } as DrizzleMock);

      const result = await service.removeFromUserList(userId, bookId);

      expect(result).toEqual([deletedRow]);
    });
  });

  describe('updateBookStatus', () => {
    it('should update book reading dates and return computed status', async () => {
      const userId = 1;
      const bookId = 1;
      const readStart = new Date('2024-01-01');
      const readEnd = new Date('2024-02-01');
      const mockBook: BookRow = makeBook({
        id: bookId,
        name: 'Book 1',
        author: 'Author 1',
        isbn: '1234567890',
      });

      // Mock list found
      mockDb.select = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([makeList({ id: 1, userId })]),
          }),
        } as DrizzleMock)
        // Mock book found
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([mockBook]),
          }),
        } as DrizzleMock);

      // Mock update
      const updatedRow: ListBookRow = makeListBook({
        bookId,
        listId: 1,
        readStart,
        readEnd,
      });
      mockDb.update = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedRow]),
          } as DrizzleMock),
        } as DrizzleMock),
      } as DrizzleMock);

      const result = await service.updateBookStatus(
        userId,
        bookId,
        readStart,
        readEnd,
      );

      const typedResult = result as BookRow & {
        status: string;
        readStart: Date | null;
        readEnd: Date | null;
      };
      expect(typedResult.status).toBe('Lu');
      expect(typedResult.readStart).toEqual(readStart);
      expect(typedResult.readEnd).toEqual(readEnd);
    });

    it('should throw HttpException if book not found in user list', async () => {
      const userId = 1;
      const bookId = 1;
      const readStart = new Date('2024-01-01');
      const readEnd = null;

      // Mock list found
      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([makeList({ id: 1, userId })]),
        }),
      } as DrizzleMock);

      // Mock update returns empty
      mockDb.update = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([]),
          }),
        }),
      } as DrizzleMock);

      await expect(
        service.updateBookStatus(userId, bookId, readStart, readEnd),
      ).rejects.toThrow(
        new HttpException('Book not found in user list', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getCategoriesForBook', () => {
    it('should return categories for a given book', async () => {
      const bookId = 1;
      const mockCategories: CategoryRow[] = [
        makeCategory({ id: 1, name: 'Fiction' }),
        makeCategory({ id: 2, name: 'Adventure' }),
      ];

      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              orderBy: jest.fn().mockReturnValue({
                execute: jest.fn().mockResolvedValue(mockCategories),
              }),
            }),
          }),
        }),
      } as DrizzleMock);

      const result = await service.getCategoriesForBook(bookId);

      expect(result).toEqual(mockCategories);
    });
  });

  describe('assignCategoriesFromNames', () => {
    it('should assign categories to a book', async () => {
      const bookId = 1;
      const categoryNames = ['Fiction', 'Adventure'];
      const mockCategory = makeCategory({ id: 1, name: 'Fiction' });

      mockCategoryService.findOrCreateByName.mockResolvedValue(mockCategory);

      mockDb.insert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          onConflictDoNothing: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue(undefined),
          }),
        }),
      } as DrizzleMock);

      await service.assignCategoriesFromNames(bookId, categoryNames);

      expect(mockCategoryService.findOrCreateByName).toHaveBeenCalledTimes(2);
      expect(mockCategoryService.findOrCreateByName).toHaveBeenCalledWith(
        'Fiction',
      );
      expect(mockCategoryService.findOrCreateByName).toHaveBeenCalledWith(
        'Adventure',
      );
    });
  });
});
