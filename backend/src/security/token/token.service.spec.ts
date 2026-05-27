import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenRepository } from './token.respository';

describe('TokenService', () => {
  let service: TokenService;

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  const tokenRepositoryMock = {
    destroyAllUserTokens: jest.fn(),
    storeRefreshToken: jest.fn(),
    getUserByRefreshToken: jest.fn(),
    destroyRefreshToken: jest.fn(),
  };

  beforeAll(() => {
    // The constructor of TokenService reads JWT_SECRET from env
    process.env.JWT_SECRET = 'test-secret-key-only-used-in-unit-tests';
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: TokenRepository, useValue: tokenRepositoryMock },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  describe('generateJWTToken', () => {
    it('signs the JWT with the correct payload (sub + userRole) and returns it', async () => {
      jwtServiceMock.signAsync.mockResolvedValue('signed.jwt.token');

      const token = await service.generateJWTToken(42, 'USER');

      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: 42,
        userRole: 'USER',
      });
      expect(token).toBe('signed.jwt.token');
    });
  });

  describe('generateRefreshToken', () => {
    it('invalidates all existing user tokens BEFORE creating a new one (single-session policy)', async () => {
      tokenRepositoryMock.storeRefreshToken.mockResolvedValue({ id: 1 });

      await service.generateRefreshToken(42);

      // The repo must have been called in this order: destroy first, then store
      const destroyOrder =
        tokenRepositoryMock.destroyAllUserTokens.mock.invocationCallOrder[0];
      const storeOrder =
        tokenRepositoryMock.storeRefreshToken.mock.invocationCallOrder[0];
      expect(destroyOrder).toBeLessThan(storeOrder);
      expect(tokenRepositoryMock.destroyAllUserTokens).toHaveBeenCalledWith(42);
    });

    it('stores the HASHED token in DB and returns the CLEAR token to the client', async () => {
      tokenRepositoryMock.storeRefreshToken.mockResolvedValue({ id: 1 });

      const clearToken = await service.generateRefreshToken(42);

      const storedData = tokenRepositoryMock.storeRefreshToken.mock.calls[0][0];
      // The clear token must NEVER equal the value stored in DB
      expect(storedData.refresh_token).not.toBe(clearToken);
      // The stored value must be a SHA-256 hex string (64 chars)
      expect(storedData.refresh_token).toHaveLength(64);
      expect(storedData.userId).toBe(42);
    });
  });

  describe('rotateTokens', () => {
    it('throws UnauthorizedException when the refresh token is unknown', async () => {
      tokenRepositoryMock.getUserByRefreshToken.mockResolvedValue(null);

      await expect(service.rotateTokens('unknown-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when the refresh token has expired', async () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      tokenRepositoryMock.getUserByRefreshToken.mockResolvedValue({
        user: { id: 42, role: 'USER' },
        refresh_token: { expiresAt: yesterday },
      });

      await expect(service.rotateTokens('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns a new pair of tokens and deletes the old one on success (happy path)', async () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      tokenRepositoryMock.getUserByRefreshToken.mockResolvedValue({
        user: { id: 42, role: 'USER' },
        refresh_token: { expiresAt: tomorrow },
      });
      tokenRepositoryMock.storeRefreshToken.mockResolvedValue({ id: 1 });
      jwtServiceMock.signAsync.mockResolvedValue('new.jwt.token');

      const result = await service.rotateTokens('valid-token');

      expect(result.newJwtToken).toBe('new.jwt.token');
      expect(result.newRefreshToken).toBeDefined();
      expect(result.user).toEqual({ sub: 42, userRole: 'USER' });
      // The OLD refresh token must be destroyed after generating the new pair
      expect(tokenRepositoryMock.destroyRefreshToken).toHaveBeenCalled();
    });
  });

  describe('destroyToken', () => {
    it('hashes the token before asking the repository to delete it', async () => {
      tokenRepositoryMock.destroyRefreshToken.mockResolvedValue(true);

      const ok = await service.destroyToken('clear-refresh-token');

      const hashedArg =
        tokenRepositoryMock.destroyRefreshToken.mock.calls[0][0];
      // Must pass the HASHED value (64 hex chars), never the clear one
      expect(hashedArg).toHaveLength(64);
      expect(hashedArg).not.toBe('clear-refresh-token');
      expect(ok).toBe(true);
    });
  });

  describe('hashRefreshToken', () => {
    it('is deterministic: the same input always produces the same hash', () => {
      const hash1 = service.hashRefreshToken('my-refresh-token');
      const hash2 = service.hashRefreshToken('my-refresh-token');
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hex length
    });
  });
});
