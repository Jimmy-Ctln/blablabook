import { Test, TestingModule } from '@nestjs/testing';
import { TokenRepository } from './token.respository';

describe('TokenRepository', () => {
  let repository: TokenRepository;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenRepository,
        {
          provide: 'DRIZZLE',
          useValue: mockDb,
        },
      ],
    }).compile();

    repository = module.get<TokenRepository>(TokenRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getUserByRefreshToken', () => {
    it('should return user and token when refresh token exists', async () => {
      const mockToken = {
        refreshToken: {
          id: 10,
          userId: 1,
          refresh_token: 'hashed_token_123',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
          role: 'USER',
        },
      };

      const selectChain = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockToken]),
      };

      mockDb.select.mockReturnValue(selectChain);

      const result = await repository.getUserByRefreshToken('hashed_token_123');

      expect(result).toEqual(mockToken);
      expect(selectChain.where).toHaveBeenCalled();
    });

    it('should return null when refresh token does not exist', async () => {
      const selectChain = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValue(selectChain);

      const result =
        await repository.getUserByRefreshToken('nonexistent_token');

      expect(result).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      const selectChain = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      mockDb.select.mockReturnValue(selectChain);

      await expect(repository.getUserByRefreshToken('token')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('storeRefreshToken', () => {
    it('should store and return refresh token', async () => {
      const tokenPayload = {
        userId: 1,
        refresh_token: 'hashed_token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      const storedToken = {
        id: 5,
        ...tokenPayload,
      };

      const insertChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([storedToken]),
      };

      mockDb.insert.mockReturnValue(insertChain);

      const result = await repository.storeRefreshToken(tokenPayload);

      expect(result).toEqual(storedToken);
      expect(insertChain.values).toHaveBeenCalledWith(tokenPayload);
    });

    it('should return null when insert returns empty result', async () => {
      const tokenPayload = {
        userId: 1,
        refresh_token: 'hashed_token',
        expiresAt: new Date(),
      };

      const insertChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };

      mockDb.insert.mockReturnValue(insertChain);

      const result = await repository.storeRefreshToken(tokenPayload);

      expect(result).toBeNull();
    });

    it('should handle database errors on insert', async () => {
      const tokenPayload = {
        userId: 1,
        refresh_token: 'token',
        expiresAt: new Date(),
      };

      const insertChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(new Error('Insert failed')),
      };

      mockDb.insert.mockReturnValue(insertChain);

      await expect(repository.storeRefreshToken(tokenPayload)).rejects.toThrow(
        'Insert failed',
      );
    });

    it('should store token with different expiration dates', async () => {
      const tokenPayload = {
        userId: 2,
        refresh_token: 'another_token',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };

      const storedToken = {
        id: 3,
        ...tokenPayload,
      };

      const insertChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([storedToken]),
      };

      mockDb.insert.mockReturnValue(insertChain);

      const result = await repository.storeRefreshToken(tokenPayload);

      expect(result).toEqual(storedToken);
    });

    it('should call insert with correct schema', async () => {
      const tokenPayload = {
        userId: 1,
        refresh_token: 'test',
        expiresAt: new Date(),
      };

      const insertChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([{ id: 1, ...tokenPayload }]),
      };

      mockDb.insert.mockReturnValue(insertChain);

      await repository.storeRefreshToken(tokenPayload);

      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('destroyRefreshToken', () => {
    it('should delete refresh token and return true', async () => {
      const deleteChain = {
        where: jest.fn().mockResolvedValue(undefined),
      };

      mockDb.delete.mockReturnValue(deleteChain);

      const result = await repository.destroyRefreshToken('hashed_token');

      expect(result).toBe(true);
      expect(deleteChain.where).toHaveBeenCalled();
    });

    it('should return true even if token does not exist', async () => {
      const deleteChain = {
        where: jest.fn().mockResolvedValue(undefined),
      };

      mockDb.delete.mockReturnValue(deleteChain);

      const result = await repository.destroyRefreshToken('nonexistent');

      expect(result).toBe(true);
    });

    it('should handle database errors on delete', async () => {
      const deleteChain = {
        where: jest.fn().mockRejectedValue(new Error('Delete failed')),
      };

      mockDb.delete.mockReturnValue(deleteChain);

      await expect(repository.destroyRefreshToken('token')).rejects.toThrow(
        'Delete failed',
      );
    });

    it('should properly call delete chain methods', async () => {
      const deleteChain = {
        where: jest.fn().mockResolvedValue(undefined),
      };

      mockDb.delete.mockReturnValue(deleteChain);

      const result = await repository.destroyRefreshToken('test_token');

      expect(mockDb.delete).toHaveBeenCalled();
      expect(deleteChain.where).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle empty refresh token string', async () => {
      const deleteChain = {
        where: jest.fn().mockResolvedValue(undefined),
      };

      mockDb.delete.mockReturnValue(deleteChain);

      const result = await repository.destroyRefreshToken('');

      expect(result).toBe(true);
    });
  });
});
