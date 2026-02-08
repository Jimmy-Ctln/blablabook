import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from './token.respository';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

describe('TokenService', () => {
  let service: TokenService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockTokenRepository = {
    storeRefreshToken: jest.fn(),
    getUserByRefreshToken: jest.fn(),
    destroyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: TokenRepository, useValue: mockTokenRepository },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateJWTToken()', () => {
    it('should generate a JWT token successfully', async () => {
      mockJwtService.signAsync.mockResolvedValue('mocked-jwt');

      const result = await service.generateJWTToken(1, 'USER');

      expect(result).toBe('mocked-jwt');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        userRole: 'USER',
      });
    });

    it('should throw InternalServerErrorException if signing fails', async () => {
      mockJwtService.signAsync.mockRejectedValue(new Error('Signing error'));

      await expect(service.generateJWTToken(1, 'USER')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('generateRefreshToken()', () => {
    it('should generate a random token and store its hash', async () => {
      mockTokenRepository.storeRefreshToken.mockResolvedValue({ id: 1 });

      const token = await service.generateRefreshToken(1);

      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // hex de 32 bytes
      expect(mockTokenRepository.storeRefreshToken).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          token: expect.any(String) as string, // Cast pour éviter le "unsafe any"
        }),
      );
    });

    it('should throw InternalServerErrorException if storage fails', async () => {
      mockTokenRepository.storeRefreshToken.mockResolvedValue(null);

      await expect(service.generateRefreshToken(1)).rejects.toThrow(
        'failed to store new refresh token',
      );
    });
  });

  describe('rotateTokens()', () => {
    const oldRawToken = 'old-token';
    const mockUserDb = {
      user: { id: 1, role: 'USER' },
      refreshToken: { id: 10, token: 'hashed-old-token' },
    };

    it('should rotate tokens and delete the old one', async () => {
      // Mock des appels internes et du repo
      mockTokenRepository.getUserByRefreshToken.mockResolvedValue(mockUserDb);
      jest.spyOn(service, 'generateJWTToken').mockResolvedValue('new-jwt');
      jest
        .spyOn(service, 'generateRefreshToken')
        .mockResolvedValue('new-refresh');

      const result = await service.rotateTokens(oldRawToken);

      expect(result).toEqual({
        newJwtToken: 'new-jwt',
        newRefreshToken: 'new-refresh',
        user: { sub: 1, userRole: 'USER' },
      });
      expect(mockTokenRepository.destroyRefreshToken).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if token is not found in DB', async () => {
      mockTokenRepository.getUserByRefreshToken.mockResolvedValue(null);

      await expect(service.rotateTokens(oldRawToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user data is missing', async () => {
      mockTokenRepository.getUserByRefreshToken.mockResolvedValue({
        user: null,
      });
      await expect(service.rotateTokens(oldRawToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
