import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { CategoryService } from '../category/category.service';
import { HttpException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let mockDb: any;
  let mockCategoryService: any;

  beforeEach(async () => {
    mockDb = {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCategoryService = {
      findOrCreateByName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: 'DRIZZLE', useValue: mockDb },
        { provide: CategoryService, useValue: mockCategoryService },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);

    // Mock logger to suppress error logs during tests
    service['logger'] = {
      error: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
      debug: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllBooks', () => {
    it('should return all books grouped by category', async () => {
      const mockBooks = [
        {
          id: 1,
          name: 'Horror Book',
          author: 'Author 1',
          cover_url: 'url1',
          description: 'desc1',
          isbn: '123',
          publishingHouse: 'House 1',
          publishedAt: new Date(),
          categoryName: 'Horror',
        },
        {
          id: 2,
          name: 'Horror Book 2',
          author: 'Author 2',
          cover_url: 'url2',
          description: 'desc2',
          isbn: '456',
          publishingHouse: 'House 2',
          publishedAt: new Date(),
          categoryName: 'Horror',
        },
        {
          id: 3,
          name: 'Romance Book',
          author: 'Author 3',
          cover_url: 'url3',
          description: 'desc3',
          isbn: '789',
          publishingHouse: 'House 3',
          publishedAt: new Date(),
          categoryName: 'Romance',
        },
      ];

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select.mockReturnValue(selectChain);

      const result = await service.findAllBooks();

      expect(result.horror).toHaveLength(2);
      expect(result.romance).toHaveLength(1);
      expect(result.horror[0].name).toBe('Horror Book');
    });

    it('should filter books by single category', async () => {
      const mockBooks = [
        {
          id: 1,
          name: 'Horror Book',
          author: 'Author 1',
          cover_url: 'url1',
          description: 'desc1',
          isbn: '123',
          publishingHouse: 'House 1',
          publishedAt: new Date(),
          categoryName: 'Horror',
        },
      ];

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select.mockReturnValue(selectChain);

      const result = await service.findAllBooks(['Horror']);

      expect(result.horror).toHaveLength(1);
      expect(selectChain.where).toHaveBeenCalled();
    });

    it('should filter books by multiple categories', async () => {
      const mockBooks = [
        {
          id: 1,
          name: 'Horror Book',
          author: 'Author 1',
          cover_url: 'url1',
          description: 'desc1',
          isbn: '123',
          publishingHouse: 'House 1',
          publishedAt: new Date(),
          categoryName: 'Horror',
        },
        {
          id: 2,
          name: 'Romance Book',
          author: 'Author 2',
          cover_url: 'url2',
          description: 'desc2',
          isbn: '456',
          publishingHouse: 'House 2',
          publishedAt: new Date(),
          categoryName: 'Romance',
        },
      ];

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select.mockReturnValue(selectChain);

      const result = await service.findAllBooks(['Horror', 'Romance']);

      expect(result.horror).toHaveLength(1);
      expect(result.romance).toHaveLength(1);
    });

    it('should normalize and filter empty categories', async () => {
      const mockBooks = [];

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select.mockReturnValue(selectChain);

      await service.findAllBooks(['  ', '', '  Horror  ']);

      expect(selectChain.where).toHaveBeenCalled();
    });

    it('should handle unknown category names', async () => {
      const mockBooks = [
        {
          id: 1,
          name: 'Unknown Book',
          author: 'Author 1',
          cover_url: 'url1',
          description: 'desc1',
          isbn: '123',
          publishingHouse: 'House 1',
          publishedAt: new Date(),
          categoryName: null,
        },
      ];

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select.mockReturnValue(selectChain);

      const result = await service.findAllBooks();

      expect(result.unknown).toHaveLength(1);
    });
  });

  describe('getRandomBooks', () => {
    it('should return random books with default limit', async () => {
      const mockBooks = [
        {
          id: 1,
          name: 'Random Book 1',
          author: 'Author 1',
          cover_url: 'url1',
        },
        {
          id: 2,
          name: 'Random Book 2',
          author: 'Author 2',
          cover_url: 'url2',
        },
      ];

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select.mockReturnValue(selectChain);

      const result = await service.getRandomBooks();

      expect(result).toHaveLength(2);
      expect(selectChain.limit).toHaveBeenCalledWith(10);
    });

    it('should return random books with custom limit', async () => {
      const mockBooks = [
        { id: 1, name: 'Random Book 1', author: 'Author 1', cover_url: 'url1' },
      ];

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select.mockReturnValue(selectChain);

      const result = await service.getRandomBooks(5);

      expect(result).toHaveLength(1);
      expect(selectChain.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('findUserBooks', () => {
    it('should return user books with pagination', async () => {
      const mockCountResult = [{ count: 20 }];
      const mockBooks = [
        {
          id: 1,
          name: 'User Book 1',
          author: 'Author 1',
          cover_url: 'url1',
          description: 'desc1',
          isbn: '123',
          publishingHouse: 'House 1',
          publishedAt: new Date(),
          categoryName: 'Horror',
          readStart: null,
          readEnd: null,
          addedAt: new Date(),
        },
      ];

      const countChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockCountResult),
      };

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select
        .mockReturnValueOnce(countChain)
        .mockReturnValueOnce(selectChain);

      const result = await service.findUserBooks(1, 0, 10);

      expect(result.books).toHaveLength(1);
      expect(result.total).toBe(20);
      expect(result.books[0].status).toBe('À lire');
    });

    it('should return empty array when user has no books', async () => {
      const mockCountResult = [{ count: 0 }];
      const mockBooks = [];

      const countChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockCountResult),
      };

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select
        .mockReturnValueOnce(countChain)
        .mockReturnValueOnce(selectChain);

      const result = await service.findUserBooks(1);

      expect(result.books).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should compute status correctly for books with different read states', async () => {
      const mockCountResult = [{ count: 3 }];
      const mockBooks = [
        {
          id: 1,
          name: 'Book 1',
          author: 'Author 1',
          cover_url: 'url1',
          description: 'desc1',
          isbn: '123',
          publishingHouse: 'House 1',
          publishedAt: new Date(),
          categoryName: 'Horror',
          readStart: null,
          readEnd: null,
          addedAt: new Date(),
        },
        {
          id: 2,
          name: 'Book 2',
          author: 'Author 2',
          cover_url: 'url2',
          description: 'desc2',
          isbn: '456',
          publishingHouse: 'House 2',
          publishedAt: new Date(),
          categoryName: 'Horror',
          readStart: new Date('2024-01-01'),
          readEnd: null,
          addedAt: new Date(),
        },
        {
          id: 3,
          name: 'Book 3',
          author: 'Author 3',
          cover_url: 'url3',
          description: 'desc3',
          isbn: '789',
          publishingHouse: 'House 3',
          publishedAt: new Date(),
          categoryName: 'Horror',
          readStart: new Date('2024-01-01'),
          readEnd: new Date('2024-02-01'),
          addedAt: new Date(),
        },
      ];

      const countChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockCountResult),
      };

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select
        .mockReturnValueOnce(countChain)
        .mockReturnValueOnce(selectChain);

      const result = await service.findUserBooks(1);

      expect(result.books[0].status).toBe('À lire');
      expect(result.books[1].status).toBe('En cours');
      expect(result.books[2].status).toBe('Lu');
    });

    it('should handle pagination with custom offset and limit', async () => {
      const mockCountResult = [{ count: 50 }];
      const mockBooks = [];

      const countChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockCountResult),
      };

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select
        .mockReturnValueOnce(countChain)
        .mockReturnValueOnce(selectChain);

      await service.findUserBooks(1, 20, 15);

      expect(selectChain.offset).toHaveBeenCalledWith(20);
      expect(selectChain.limit).toHaveBeenCalledWith(15);
    });
  });

  describe('addToUserList', () => {
    it('should reuse existing book when adding by ISBN', async () => {
      const createDto = {
        name: 'Existing Book',
        author: 'Author',
        coverUrl: 'url',
        description: 'Description',
        isbn: '123',
        publishingHouse: 'House',
        publishedAt: new Date(),
        categories: [],
      };

      const mockExistingBook = {
        id: 1,
        name: 'Existing Book',
        author: 'Author',
        cover_url: 'url',
        description: 'Description',
        isbn: '123',
        publishingHouse: 'House',
        publishedAt: new Date(),
        categoryId: 1,
      };

      const mockUserList = {
        id: 1,
        userId: 1,
        name: 'My List',
      };

      // Book found
      const selectChain1 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockExistingBook]),
      };

      // User list found
      const selectChain2 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUserList]),
      };

      // Insert list book
      const insertChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };

      mockDb.select
        .mockReturnValueOnce(selectChain1)
        .mockReturnValueOnce(selectChain2);

      mockDb.insert.mockReturnValueOnce(insertChain);

      const result = await service.addToUserList(1, createDto);

      expect(result.id).toBe(1);
      expect(result.isbn).toBe('123');
    });

    it('should create user list if not exists', async () => {
      const createDto = {
        name: 'New Book',
        author: 'Author',
        coverUrl: 'url',
        description: 'Description',
        isbn: '999',
        publishingHouse: 'House',
        publishedAt: new Date(),
        categories: [],
      };

      const mockBook = {
        id: 1,
        name: 'New Book',
        author: 'Author',
        cover_url: 'url',
        description: 'Description',
        isbn: '999',
        publishingHouse: 'House',
        publishedAt: new Date(),
        categoryId: 1,
      };

      const mockNewList = {
        id: 1,
        userId: 1,
        name: 'My List',
      };

      // Book found
      const selectChain1 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockBook]),
      };

      // User list NOT found
      const selectChain2 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      // Insert list
      const insertChain1 = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockNewList]),
      };

      // Insert list book
      const insertChain2 = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };

      mockDb.select
        .mockReturnValueOnce(selectChain1)
        .mockReturnValueOnce(selectChain2);

      mockDb.insert
        .mockReturnValueOnce(insertChain1)
        .mockReturnValueOnce(insertChain2);

      const result = await service.addToUserList(1, createDto);

      expect(result.id).toBe(1);
    });

    it('should throw HttpException on database errors', async () => {
      const createDto = {
        name: 'New Book',
        author: 'Author',
        coverUrl: 'url',
        description: 'Description',
        isbn: '777',
        publishingHouse: 'House',
        publishedAt: new Date(),
        categories: [],
      };

      // Book lookup fails
      const selectChain1 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      mockDb.select.mockReturnValueOnce(selectChain1);

      await expect(service.addToUserList(1, createDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should add new book to user list without categories', async () => {
      const createDto = {
        name: 'Simple Book',
        author: 'Author',
        coverUrl: 'url',
        description: 'Description',
        isbn: '555',
        publishingHouse: 'House',
        publishedAt: new Date(),
        categories: [],
      };

      const mockBook = {
        id: 2,
        name: 'Simple Book',
        author: 'Author',
        cover_url: 'url',
        isbn: '555',
        categoryId: 1,
      };

      const mockUserList = { id: 1, userId: 1, name: 'My List' };

      // Book not found
      const selectChain1 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      // Book created
      const insertChain1 = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockBook]),
      };

      // List found
      const selectChain2 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUserList]),
      };

      // Insert list book
      const insertChain2 = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };

      mockDb.select
        .mockReturnValueOnce(selectChain1)
        .mockReturnValueOnce(selectChain2);

      mockDb.insert
        .mockReturnValueOnce(insertChain1)
        .mockReturnValueOnce(insertChain2);

      const result = await service.addToUserList(1, createDto);

      expect(result.id).toBe(2);
      expect(result.name).toBe('Simple Book');
    });
  });

  describe('removeFromUserList', () => {
    it('should remove book from user list', async () => {
      const mockUserList = { id: 1, userId: 1 };
      const mockDeletedItems = [{ id: 1, bookId: 1, listId: 1 }];

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUserList]),
      };

      const deleteChain = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue(mockDeletedItems),
      };

      mockDb.select.mockReturnValue(selectChain);
      mockDb.delete.mockReturnValue(deleteChain);

      const result = await service.removeFromUserList(1, 1);

      expect(result).toHaveLength(1);
      expect(result[0].bookId).toBe(1);
    });

    it('should return null when user has no list', async () => {
      const selectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValue(selectChain);

      const result = await service.removeFromUserList(1, 1);

      expect(result).toBeNull();
    });
  });

  describe('updateBookStatus', () => {
    it('should update book reading dates', async () => {
      const readStart = new Date('2024-01-01');
      const readEnd = new Date('2024-02-01');

      const mockUserList = { id: 1, userId: 1 };
      const mockUpdatedListBook = [
        {
          id: 1,
          bookId: 1,
          listId: 1,
          readStart,
          readEnd,
        },
      ];

      const mockBook = {
        id: 1,
        name: 'Test Book',
        author: 'Author',
        isbn: '123',
        categoryId: 1,
      };

      // Find user list
      const selectChain1 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUserList]),
      };

      // Update list book
      const updateChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue(mockUpdatedListBook),
      };

      // Get book
      const selectChain2 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockBook]),
      };

      mockDb.select
        .mockReturnValueOnce(selectChain1)
        .mockReturnValueOnce(selectChain2);

      mockDb.update.mockReturnValue(updateChain);

      const result = await service.updateBookStatus(1, 1, readStart, readEnd);

      expect(result.id).toBe(1);
      expect(updateChain.set).toHaveBeenCalledWith(
        expect.objectContaining({
          readStart,
          readEnd,
        }),
      );
    });

    it('should throw HttpException when user list not found', async () => {
      const selectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValue(selectChain);

      await expect(
        service.updateBookStatus(999, 1, new Date(), null),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when book not in user list', async () => {
      const mockUserList = { id: 1, userId: 1 };

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUserList]),
      };

      const updateChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValue(selectChain);
      mockDb.update.mockReturnValue(updateChain);

      await expect(
        service.updateBookStatus(1, 999, new Date(), null),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when book not found', async () => {
      const mockUserList = { id: 1, userId: 1 };
      const mockUpdatedListBook = [
        {
          id: 1,
          bookId: 1,
          listId: 1,
          readStart: new Date(),
          readEnd: null,
        },
      ];

      const selectChain1 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUserList]),
      };

      const updateChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue(mockUpdatedListBook),
      };

      const selectChain2 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      mockDb.select
        .mockReturnValueOnce(selectChain1)
        .mockReturnValueOnce(selectChain2);

      mockDb.update.mockReturnValue(updateChain);

      await expect(
        service.updateBookStatus(1, 1, new Date(), null),
      ).rejects.toThrow(HttpException);
    });

    it('should compute status correctly based on read dates', async () => {
      const readStart = new Date('2024-01-01');
      const readEnd = new Date('2024-02-01');

      const mockUserList = { id: 1, userId: 1 };
      const mockUpdatedListBook = [
        {
          id: 1,
          bookId: 1,
          listId: 1,
          readStart,
          readEnd,
        },
      ];

      const mockBook = {
        id: 1,
        name: 'Test Book',
        author: 'Author',
        isbn: '123',
        categoryId: 1,
      };

      const selectChain1 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUserList]),
      };

      const updateChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue(mockUpdatedListBook),
      };

      const selectChain2 = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockBook]),
      };

      mockDb.select
        .mockReturnValueOnce(selectChain1)
        .mockReturnValueOnce(selectChain2);

      mockDb.update.mockReturnValue(updateChain);

      const result = await service.updateBookStatus(1, 1, readStart, readEnd);

      expect(result).toHaveProperty('status');
      expect(result.status).toBe('Lu');
    });

    it('should handle generic errors', async () => {
      const mockUserList = { id: 1, userId: 1 };

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValue(new Error('Generic database error')),
      };

      mockDb.select.mockReturnValue(selectChain);

      await expect(
        service.updateBookStatus(1, 1, new Date(), null),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('computeStatus (private method via public methods)', () => {
    it('should return "À lire" when no read dates', async () => {
      const mockCountResult = [{ count: 1 }];
      const mockBooks = [
        {
          id: 1,
          name: 'Test',
          author: 'Author',
          cover_url: 'url',
          description: 'desc',
          isbn: '123',
          publishingHouse: 'House',
          publishedAt: new Date(),
          categoryName: 'Horror',
          readStart: null,
          readEnd: null,
          addedAt: new Date(),
        },
      ];

      const countChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockCountResult),
      };

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select
        .mockReturnValueOnce(countChain)
        .mockReturnValueOnce(selectChain);

      const result = await service.findUserBooks(1);
      expect(result.books[0].status).toBe('À lire');
    });

    it('should return "En cours" when readStart is set', async () => {
      const mockCountResult = [{ count: 1 }];
      const mockBooks = [
        {
          id: 1,
          name: 'Test',
          author: 'Author',
          cover_url: 'url',
          description: 'desc',
          isbn: '123',
          publishingHouse: 'House',
          publishedAt: new Date(),
          categoryName: 'Horror',
          readStart: new Date('2024-01-01'),
          readEnd: null,
          addedAt: new Date(),
        },
      ];

      const countChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockCountResult),
      };

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select
        .mockReturnValueOnce(countChain)
        .mockReturnValueOnce(selectChain);

      const result = await service.findUserBooks(1);
      expect(result.books[0].status).toBe('En cours');
    });

    it('should return "Lu" when both dates are set', async () => {
      const mockCountResult = [{ count: 1 }];
      const mockBooks = [
        {
          id: 1,
          name: 'Test',
          author: 'Author',
          cover_url: 'url',
          description: 'desc',
          isbn: '123',
          publishingHouse: 'House',
          publishedAt: new Date(),
          categoryName: 'Horror',
          readStart: new Date('2024-01-01'),
          readEnd: new Date('2024-02-01'),
          addedAt: new Date(),
        },
      ];

      const countChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockCountResult),
      };

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks),
      };

      mockDb.select
        .mockReturnValueOnce(countChain)
        .mockReturnValueOnce(selectChain);

      const result = await service.findUserBooks(1);
      expect(result.books[0].status).toBe('Lu');
    });
  });
});
