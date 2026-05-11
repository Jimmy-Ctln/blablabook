import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { CategoryService } from '../category/category.service';

describe('BooksService', () => {
  let service: BooksService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockCategoryService = {
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

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add book to user list', async () => {
    const createDto = {
      name: 'Test Book',
      author: 'Author',
      coverUrl: 'url',
      description: 'Description',
      isbn: '123',
      publishingHouse: 'House',
      publishedAt: '2024-01-01',
      categories: [],
    };

    const mockBook = { id: 1, isbn: '123' };
    const mockUserList = { id: 1, userId: 1 };

    const selectChain1 = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockBook]),
    };

    const selectChain2 = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockUserList]),
    };

    const insertChain = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([]),
    };

    mockDb.select
      .mockReturnValueOnce(selectChain1)
      .mockReturnValueOnce(selectChain2);
    mockDb.insert.mockReturnValue(insertChain);

    const result = await service.addToUserList(1, createDto);

    expect(result.id).toBe(1);
    expect(result.isbn).toBe('123');
  });

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
    expect(result![0].bookId).toBe(1);
  });

  it('should find user books with status', async () => {
    const mockCountResult = [{ count: 2 }];
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

    expect(result.books).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.books[0].status).toBe('À lire');
    expect(result.books[1].status).toBe('En cours');
  });

  it('should find all books by categories', async () => {
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
      },
    ];

    const selectChain = {
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(mockBooks),
    };

    mockDb.select.mockReturnValue(selectChain);

    const result = await service.findAllBooks(['Horror']);

    expect(result['horror']).toHaveLength(2);
    expect(result['horror'][0].name).toBe('Book 1');
  });

  it('should get random books with limit', async () => {
    const mockBooks = [
      {
        id: 1,
        name: 'Random Book 1',
        author: 'Author 1',
        cover_url: 'cover1.jpg',
        description: 'Desc 1',
        isbn: '123',
        publishingHouse: 'House 1',
        publishedAt: '2020-01-01',
        categoryId: 1,
        categoryName: 'aventure',
      },
      {
        id: 2,
        name: 'Random Book 2',
        author: 'Author 2',
        cover_url: 'cover2.jpg',
        description: 'Desc 2',
        isbn: '456',
        publishingHouse: 'House 2',
        publishedAt: '2021-01-01',
        categoryId: 2,
        categoryName: 'romance',
      },
    ];

    const selectChain = {
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockBooks),
    };

    mockDb.select.mockReturnValue(selectChain);

    const result = await service.getRandomBooks(2);

    expect(result).toHaveLength(2);
    expect(selectChain.limit).toHaveBeenCalledWith(2);
    expect(selectChain.innerJoin).toHaveBeenCalled();
  });

  it('should update book status with reading dates', async () => {
    const mockUserList = { id: 1, userId: 1 };
    const mockBook = { id: 1, name: 'Test Book' };
    const readStart = new Date('2024-01-01');
    const readEnd = new Date('2024-02-01');

    // Mock first select (get user list)
    const selectChain1 = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockUserList]),
    };

    // Mock update (modify listBook)
    const returningChain = {
      returning: jest.fn().mockResolvedValue([{ readStart, readEnd }]),
    };
    const updateChain = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnValue(returningChain),
    };

    // Mock second select (get book)
    const selectChain2 = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockBook]),
    };

    mockDb.select
      .mockReturnValueOnce(selectChain1)
      .mockReturnValueOnce(selectChain2);
    mockDb.update.mockReturnValue(updateChain);

    const result = await service.updateBookStatus(1, 1, readStart, readEnd);

    expect(result).toBeDefined();
    expect(updateChain.set).toHaveBeenCalled();
  });

  it('should throw error when user list not found during update', async () => {
    const selectChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
    };

    mockDb.select.mockReturnValue(selectChain);

    await expect(
      service.updateBookStatus(1, 1, new Date(), null),
    ).rejects.toThrow();
  });

  it('should create new book when not existing', async () => {
    const createDto = {
      name: 'New Book',
      author: 'New Author',
      coverUrl: 'url',
      description: 'Description',
      isbn: '999',
      publishingHouse: 'House',
      publishedAt: '2024-03-01',
      categories: ['Horror'],
    };

    const mockNewBook = { id: 2, isbn: '999' };

    // Mock: book not found
    const selectChain1 = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
    };

    // Mock: keywords matching
    const selectChain2 = {
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([{ categoryId: 2, keywordId: 5 }]),
    };

    // Mock: category result
    const selectChain3 = {
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ categoryId: 2 }]),
    };

    // Mock: insert book
    const insertChain1 = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockNewBook]),
    };

    // Mock: user list
    const selectChain4 = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([{ id: 1, userId: 1 }]),
    };

    // Mock: insert book-keyword
    const insertChain2 = {
      values: jest.fn().mockReturnThis(),
    };

    // Mock: insert list-book
    const insertChain3 = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([]),
    };

    mockDb.select
      .mockReturnValueOnce(selectChain1)
      .mockReturnValueOnce(selectChain2)
      .mockReturnValueOnce(selectChain3)
      .mockReturnValueOnce(selectChain4);

    mockDb.insert
      .mockReturnValueOnce(insertChain1)
      .mockReturnValueOnce(insertChain2)
      .mockReturnValueOnce(insertChain3);

    const result = await service.addToUserList(1, createDto);

    expect(result.id).toBe(2);
    expect(result.isbn).toBe('999');
  });

  it('should create user list if not existing', async () => {
    const createDto = {
      name: 'Test Book',
      author: 'Author',
      coverUrl: 'url',
      description: 'Description',
      isbn: '123',
      publishingHouse: 'House',
      publishedAt: '2024-01-01',
      categories: [],
    };

    const mockBook = { id: 1, isbn: '123' };
    const mockCreatedList = { id: 1, userId: 1 };

    // Mock: book exists
    const selectChain1 = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockBook]),
    };

    // Mock: user list not found
    const selectChain2 = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
    };

    // Mock: insert new list
    const insertChain1 = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockCreatedList]),
    };

    // Mock: insert list-book
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
    expect(insertChain1.values).toHaveBeenCalled();
  });

  it('should handle error when adding book to list', async () => {
    const createDto = {
      name: 'Test Book',
      author: 'Author',
      coverUrl: 'url',
      description: 'Description',
      isbn: '123',
      publishingHouse: 'House',
      publishedAt: '2024-01-01',
      categories: [],
    };

    const selectChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockRejectedValue(new Error('Database error')),
    };

    mockDb.select.mockReturnValue(selectChain);

    await expect(service.addToUserList(1, createDto)).rejects.toThrow(
      'Unable to add book to user list',
    );
  });
});
