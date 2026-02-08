import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { book, category, listBook } from '../db/schema';

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
  getCategoriesForBook: jest.Mock<
    Promise<Array<Pick<CategoryRow, 'id' | 'name'>>>
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
      getCategoriesForBook: jest.fn(),
    } as unknown as BooksServiceMock;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

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

      const result = await controller.getUserBooks(userId);

      expect(result).toEqual(mockUserBooks);
      expect(mockBooksService.findUserBooks).toHaveBeenCalledWith(userId);
      expect(mockBooksService.findUserBooks).toHaveBeenCalledTimes(1);
    });

    it('should handle empty user library', async () => {
      const userId = 2;

      mockBooksService.findUserBooks.mockResolvedValue([]);

      const result = await controller.getUserBooks(userId);

      expect(result).toEqual([]);
      expect(mockBooksService.findUserBooks).toHaveBeenCalledWith(userId);
    });
  });

  describe('addBookToUserList', () => {
    it('should add a book to user library', async () => {
      const userId = 1;
      const createBookDto = {
        name: 'New Book',
        author: 'New Author',
        isbn: '1234567890',
        coverId: 'cover123',
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
        coverId: createBookDto.coverId,
        description: createBookDto.description,
        publishingHouse: createBookDto.publishingHouse,
        publishedAt: createBookDto.publishedAt,
      });

      mockBooksService.addToUserList.mockResolvedValue(mockAddedBook);

      const result = await controller.addBookToUserList(userId, createBookDto);

      expect(result).toEqual(mockAddedBook);
      expect(mockBooksService.addToUserList).toHaveBeenCalledWith(
        userId,
        createBookDto,
      );
      expect(mockBooksService.addToUserList).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when adding book', async () => {
      const userId = 1;
      const createBookDto = {
        name: 'Book',
        author: 'Author',
        isbn: '1234567890',
        coverId: 'cover',
        description: 'Description',
        publishingHouse: 'House',
        publishedAt: '2023-01-01',
        categories: [],
      };

      const error = new Error('Database error');
      mockBooksService.addToUserList.mockRejectedValue(error);

      await expect(
        controller.addBookToUserList(userId, createBookDto),
      ).rejects.toThrow('Database error');

      expect(mockBooksService.addToUserList).toHaveBeenCalledWith(
        userId,
        createBookDto,
      );
    });
  });

  describe('removeBookFromUserList', () => {
    it('should remove a book from user library', async () => {
      const userId = 1;
      const bookId = 1;
      const mockDeletedRow: ListBookRow = makeListBook({ bookId, listId: 1 });

      mockBooksService.removeFromUserList.mockResolvedValue([mockDeletedRow]);

      const result = await controller.removeBookFromUserList(userId, bookId);

      expect(result).toEqual([mockDeletedRow]);
      expect(mockBooksService.removeFromUserList).toHaveBeenCalledWith(
        userId,
        bookId,
      );
      expect(mockBooksService.removeFromUserList).toHaveBeenCalledTimes(1);
    });

    it('should return null if book not found in user list', async () => {
      const userId = 1;
      const bookId = 99;

      mockBooksService.removeFromUserList.mockResolvedValue(null);

      const result = await controller.removeBookFromUserList(userId, bookId);

      expect(result).toBeNull();
      expect(mockBooksService.removeFromUserList).toHaveBeenCalledWith(
        userId,
        bookId,
      );
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

      const result = await controller.updateBookStatusDates(
        userId,
        bookId,
        updateStatusDto,
      );

      expect(result).toEqual(mockUpdatedBook);
      expect(mockBooksService.updateBookStatus).toHaveBeenCalledWith(
        userId,
        bookId,
        new Date('2024-01-01'),
        new Date('2024-02-01'),
      );
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

      const result = await controller.updateBookStatusDates(
        userId,
        bookId,
        updateStatusDto,
      );

      expect(result).toEqual(mockUpdatedBook);
      expect(mockBooksService.updateBookStatus).toHaveBeenCalledWith(
        userId,
        bookId,
        null,
        null,
      );
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

      const result = await controller.updateBookStatusDates(
        userId,
        bookId,
        updateStatusDto,
      );

      expect(result).toEqual(mockUpdatedBook);
      expect(mockBooksService.updateBookStatus).toHaveBeenCalledWith(
        userId,
        bookId,
        new Date('2024-01-01'),
        null,
      );
    });
  });

  describe('getCategoriesForBook', () => {
    it('should return categories for a book', async () => {
      const bookId = 1;
      const mockCategories: Array<Pick<CategoryRow, 'id' | 'name'>> = [
        { id: 1, name: 'Fiction' },
        { id: 2, name: 'Adventure' },
      ];

      mockBooksService.getCategoriesForBook.mockResolvedValue(mockCategories);

      const result = await controller.getCategoriesForBook(bookId);

      expect(result).toEqual(mockCategories);
      expect(mockBooksService.getCategoriesForBook).toHaveBeenCalledWith(
        bookId,
      );
      expect(mockBooksService.getCategoriesForBook).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no categories found', async () => {
      const bookId = 99;

      mockBooksService.getCategoriesForBook.mockResolvedValue([]);

      const result = await controller.getCategoriesForBook(bookId);

      expect(result).toEqual([]);
      expect(mockBooksService.getCategoriesForBook).toHaveBeenCalledWith(
        bookId,
      );
    });
  });
});
