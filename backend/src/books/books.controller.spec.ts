import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { book, category, listBook } from '../db/schema';
import { AuthGuard } from '../auth/auth.guard';

type BookRow = typeof book.$inferSelect;
type CategoryRow = typeof category.$inferSelect;
type ListBookRow = typeof listBook.$inferSelect;
type UserBook = BookRow & {
  status: string;
  categories?: string[];
  readStart?: Date | null;
  readEnd?: Date | null;
};

interface BooksServiceMock {
  findAllBooks: jest.Mock<Promise<BookRow[]>>;
  findUserBooks: jest.Mock<Promise<UserBook[]>>;
  addToUserList: jest.Mock<Promise<BookRow>>;
  removeFromUserList: jest.Mock<Promise<ListBookRow[] | null>>;
  updateBookStatus: jest.Mock<Promise<UserBook>>;
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

describe('BooksController', () => {
  let controller: BooksController;
  let mockBooksService: BooksServiceMock;

  beforeEach(async () => {
    // Mock BooksService
    mockBooksService = {
      findAllBooks: jest.fn(),
      findUserBooks: jest.fn(),
      addToUserList: jest.fn(),
      removeFromUserList: jest.fn(),
      updateBookStatus: jest.fn(),
    } as unknown as BooksServiceMock;

    // Mock JwtService for AuthGuard
    const mockJwtService = {
      verifyAsync: jest.fn(),
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
        {
          provide: 'JWT_SERVICE',
          useValue: mockJwtService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<BooksController>(BooksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllBooks', () => {
    it('should return all books', async () => {
      const mockBooks: BookRow[] = [
        makeBook({
          id: 1,
          name: 'Book 1',
          author: 'Author 1',
          isbn: '1234567890',
        }),
        makeBook({
          id: 2,
          name: 'Book 2',
          author: 'Author 2',
          isbn: '0987654321',
        }),
      ];

      mockBooksService.findAllBooks.mockResolvedValue(mockBooks);

      const result = await controller.getAllBooks();

      expect(result).toEqual(mockBooks);
      expect(mockBooksService.findAllBooks).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserBooks', () => {
    it('should return user books with status', async () => {
      const userId = 1;
      const mockUserBooks: UserBook[] = [
        {
          ...makeBook({
            id: 1,
            name: 'Book 1',
            author: 'Author 1',
            isbn: '1234567890',
          }),
          status: 'En cours',
          categories: ['Fiction'],
        },
      ];

      mockBooksService.findUserBooks.mockResolvedValue(mockUserBooks);

      // Create a mock request with user data
      const mockRequest = {
        user: { sub: userId },
      } as any;

      const result = await controller.getUserBooks(userId, mockRequest);

      expect(result).toEqual(mockUserBooks);
    });

    it('should handle empty user library', async () => {
      const userId = 2;

      mockBooksService.findUserBooks.mockResolvedValue([]);

      const mockRequest = {
        user: { sub: userId },
      } as any;

      const result = await controller.getUserBooks(userId, mockRequest);

      expect(result).toEqual([]);
    });
  });

  describe('addBookToUserList', () => {
    it('should add a book to user library', async () => {
      const userId = 1;
      const createBookDto = {
        name: 'New Book',
        author: 'New Author',
        isbn: '1234567890',
        coverUrl: 'cover123',
        description: 'A new book',
        publishingHouse: 'New House',
        publishedAt: '2023-01-01',
        categories: ['Fiction'],
      };

      const mockAddedBook: BookRow = makeBook({
        id: 1,
        name: createBookDto.name,
        author: createBookDto.author,
        isbn: createBookDto.isbn,
        description: createBookDto.description,
        publishingHouse: createBookDto.publishingHouse,
        publishedAt: createBookDto.publishedAt,
      });

      mockBooksService.addToUserList.mockResolvedValue(mockAddedBook);

      const mockRequest = {
        user: { sub: userId },
      } as any;

      const result = await controller.addBookToUserList(
        userId,
        createBookDto,
        mockRequest,
      );

      expect(result).toEqual(mockAddedBook);
      expect(mockBooksService.addToUserList).toHaveBeenCalledWith(
        userId,
        createBookDto,
      );
    });

    it('should handle errors when adding book', async () => {
      const userId = 1;
      const createBookDto = {
        name: 'Book',
        author: 'Author',
        isbn: '1234567890',
        coverUrl: 'cover',
        description: 'Description',
        publishingHouse: 'House',
        publishedAt: '2023-01-01',
        categories: [],
      };

      const error = new Error('Database error');
      mockBooksService.addToUserList.mockRejectedValue(error);

      const mockRequest = {
        user: { sub: userId },
      } as any;

      await expect(
        controller.addBookToUserList(userId, createBookDto, mockRequest),
      ).rejects.toThrow('Database error');
    });
  });

  describe('removeBookFromUserList', () => {
    it('should remove a book from user library', async () => {
      const userId = 1;
      const bookId = 1;
      const mockDeletedRow: ListBookRow = makeListBook({ bookId, listId: 1 });

      mockBooksService.removeFromUserList.mockResolvedValue([mockDeletedRow]);

      const mockRequest = {
        user: { sub: userId },
      } as any;

      const result = await controller.removeBookFromUserList(
        userId,
        bookId,
        mockRequest,
      );

      expect(result).toEqual([mockDeletedRow]);
    });

    it('should return null if book not found in user list', async () => {
      const userId = 1;
      const bookId = 99;

      mockBooksService.removeFromUserList.mockResolvedValue(null);

      const mockRequest = {
        user: { sub: userId },
      } as any;

      const result = await controller.removeBookFromUserList(
        userId,
        bookId,
        mockRequest,
      );

      expect(result).toBeNull();
    });
  });

  describe('updateBookStatusDates', () => {
    it('should update book reading status', async () => {
      const userId = 1;
      const bookId = 1;
      const updateStatusDto = {
        readStart: '2024-01-01',
        readEnd: '2024-02-01',
      };

      const mockUpdatedBook: UserBook = {
        ...makeBook({
          id: bookId,
          name: 'Book 1',
          author: 'Author 1',
          isbn: '1234567890',
        }),
        status: 'Lu',
        readStart: new Date('2024-01-01'),
        readEnd: new Date('2024-02-01'),
      };

      mockBooksService.updateBookStatus.mockResolvedValue(mockUpdatedBook);

      const mockRequest = {
        user: { sub: userId },
      } as any;

      const result = await controller.updateBookStatusDates(
        userId,
        bookId,
        updateStatusDto,
        mockRequest,
      );

      expect(result).toEqual(mockUpdatedBook);
    });

    it('should handle null dates for status update', async () => {
      const userId = 1;
      const bookId = 1;
      const updateStatusDto = {
        readStart: null,
        readEnd: null,
      };

      const mockUpdatedBook: UserBook = {
        ...makeBook({
          id: bookId,
          name: 'Book 1',
          author: 'Author 1',
          isbn: '1234567890',
        }),
        status: 'À lire',
        readStart: null,
        readEnd: null,
      };

      mockBooksService.updateBookStatus.mockResolvedValue(mockUpdatedBook);

      const mockRequest = {
        user: { sub: userId },
      } as any;

      const result = await controller.updateBookStatusDates(
        userId,
        bookId,
        updateStatusDto,
        mockRequest,
      );

      expect(result).toEqual(mockUpdatedBook);
    });

    it('should handle partial date updates', async () => {
      const userId = 1;
      const bookId = 1;
      const updateStatusDto = {
        readStart: '2024-01-01',
        readEnd: null,
      };

      const mockUpdatedBook: UserBook = {
        ...makeBook({
          id: bookId,
          name: 'Book 1',
        }),
        status: 'En cours',
        readStart: new Date('2024-01-01'),
        readEnd: null,
      };

      mockBooksService.updateBookStatus.mockResolvedValue(mockUpdatedBook);

      const mockRequest = {
        user: { sub: userId },
      } as any;

      const result = await controller.updateBookStatusDates(
        userId,
        bookId,
        updateStatusDto,
        mockRequest,
      );

      expect(result).toEqual(mockUpdatedBook);
    });
  });
});
