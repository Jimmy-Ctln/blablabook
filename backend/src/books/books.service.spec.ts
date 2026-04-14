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

  it('should add book to user list', async () => {
    const createDto = {
      name: 'Test Book',
      author: 'Author',
      coverUrl: 'url',
      description: 'Description',
      isbn: '123',
      publishingHouse: 'House',
      publishedAt: new Date(),
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
    expect(result[0].bookId).toBe(1);
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
});
