import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;

  // Helpers to build chained Drizzle mocks
  const makeSelectWhereChain = (rows: unknown[]) => ({
    from: () => ({
      where: () => ({ execute: () => Promise.resolve(rows) }),
    }),
  });

  const makeInsertChain = (rows: unknown[]) => ({
    values: () => ({ returning: () => Promise.resolve(rows) }),
  });

  const dbMock = {
    select: jest.fn(),
    insert: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: 'DRIZZLE', useValue: dbMock },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  describe('findAll', () => {
    it('returns all active categories mapped to a clean DTO', async () => {
      dbMock.select.mockReturnValue(
        makeSelectWhereChain([
          { id: 1, name: 'fantasy', isActive: true },
          { id: 2, name: 'romance', isActive: true },
        ]),
      );

      const result = await service.findAll();

      expect(result).toEqual([
        { id: 1, name: 'fantasy' },
        { id: 2, name: 'romance' },
      ]);
    });
  });

  describe('findOne', () => {
    it('returns the category when it exists', async () => {
      dbMock.select.mockReturnValue(
        makeSelectWhereChain([{ id: 5, name: 'horror', isActive: true }]),
      );

      const result = await service.findOne(5);

      expect(result).toEqual({ id: 5, name: 'horror' });
    });

    it('throws NotFoundException when the category does not exist', async () => {
      dbMock.select.mockReturnValue(makeSelectWhereChain([]));

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOrCreateByName', () => {
    it('throws BadRequestException when the name is empty (after trim)', async () => {
      await expect(service.findOrCreateByName('   ')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('returns the existing category when one already matches (case-insensitive)', async () => {
      dbMock.select.mockReturnValue(
        makeSelectWhereChain([{ id: 3, name: 'fantasy' }]),
      );

      const result = await service.findOrCreateByName('FANTASY');

      expect(result).toEqual({ id: 3, name: 'fantasy' });
      // Must NOT have tried to insert a duplicate
      expect(dbMock.insert).not.toHaveBeenCalled();
    });

    it('creates a new category when none matches', async () => {
      dbMock.select.mockReturnValue(makeSelectWhereChain([]));
      dbMock.insert.mockReturnValue(
        makeInsertChain([{ id: 10, name: 'biography' }]),
      );

      const result = await service.findOrCreateByName('biography');

      expect(result).toEqual({ id: 10, name: 'biography' });
      expect(dbMock.insert).toHaveBeenCalled();
    });
  });
});
