import { Test, TestingModule } from '@nestjs/testing';
import { TokenRepository } from './token.respository';

describe('TokenRepository', () => {
  let repository: TokenRepository;

  // Helpers to build chained Drizzle mocks (db.select().from().leftJoin().where()...)
  const makeSelectChain = (resolvedRows: unknown[]) => ({
    from: () => ({
      leftJoin: () => ({
        where: () => Promise.resolve(resolvedRows),
      }),
    }),
  });

  const makeInsertChain = (resolvedRows: unknown[]) => ({
    values: () => ({
      returning: () => Promise.resolve(resolvedRows),
    }),
  });

  const makeDeleteChain = (resolvedRows: unknown[]) => ({
    where: () => ({
      returning: () => Promise.resolve(resolvedRows),
    }),
  });

  // For destroyAllUserTokens, .delete().where() is awaited directly (no .returning())
  const makeDeleteNoReturnChain = () => ({
    where: () => Promise.resolve(),
  });

  const dbMock = {
    select: jest.fn(),
    insert: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenRepository,
        { provide: 'DRIZZLE', useValue: dbMock },
      ],
    }).compile();

    repository = module.get<TokenRepository>(TokenRepository);
  });

  describe('getUserByRefreshToken', () => {
    it('returns null when no row matches the hashed token', async () => {
      dbMock.select.mockReturnValue(makeSelectChain([]));

      const result = await repository.getUserByRefreshToken('unknown-hash');

      expect(result).toBeNull();
    });

    it('returns the first row when a row matches', async () => {
      const row = {
        user: { id: 1, role: 'USER' },
        refresh_token: { id: 99, refresh_token: 'hash' },
      };
      dbMock.select.mockReturnValue(makeSelectChain([row]));

      const result = await repository.getUserByRefreshToken('matching-hash');

      expect(result).toBe(row);
    });
  });

  describe('storeRefreshToken', () => {
    it('returns the inserted refresh token row', async () => {
      const inserted = { id: 1, refresh_token: 'hash', userId: 42 };
      dbMock.insert.mockReturnValue(makeInsertChain([inserted]));

      const result = await repository.storeRefreshToken({
        refresh_token: 'hash',
        userId: 42,
        expiresAt: new Date(),
      });

      expect(result).toBe(inserted);
    });
  });

  describe('destroyRefreshToken', () => {
    it('returns true when at least one row was deleted', async () => {
      dbMock.delete.mockReturnValue(makeDeleteChain([{ id: 99 }]));

      const ok = await repository.destroyRefreshToken('hash');

      expect(ok).toBe(true);
    });

    it('returns false when no row was deleted', async () => {
      dbMock.delete.mockReturnValue(makeDeleteChain([]));

      const ok = await repository.destroyRefreshToken('unknown-hash');

      expect(ok).toBe(false);
    });
  });

  describe('destroyAllUserTokens', () => {
    it('calls db.delete (used by the single-session policy)', async () => {
      dbMock.delete.mockReturnValue(makeDeleteNoReturnChain());

      await repository.destroyAllUserTokens(42);

      expect(dbMock.delete).toHaveBeenCalled();
    });
  });
});
