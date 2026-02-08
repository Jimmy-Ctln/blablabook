import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt'; // Importe bien la classe !
import { TokenService } from '../security/token/token.service';
import { CookieService } from '../security/cookie/cookie.service';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  const jwtServiceMock = {
    verify: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const tokenServiceMock = {
    rotateTokens: jest.fn(),
  };

  const cookieServiceMock = {
    generateCookiesConfig: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: CookieService, useValue: cookieServiceMock },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe('authGuard.extractTokenFromCookie', () => {
    it('should extract tokens from cookies when present', () => {
      const mockRequest = {
        cookies: {
          jwt_cookie: 'fake-jwt-token',
          refresh_cookie: 'fake-refresh-token',
        },
      };

      const result = authGuard['extractTokenFromCookie'](mockRequest);

      expect(result).toEqual({
        jwtCookie: 'fake-jwt-token',
        refreshTokenCookie: 'fake-refresh-token',
      });
    });

    it('should return nulls when cookies are missing', () => {
      const mockRequest = {
        cookies: {},
      };

      const result = authGuard['extractTokenFromCookie'](mockRequest);

      expect(result).toEqual({
        jwtCookie: null,
        refreshTokenCookie: null,
      });
    });

    it('should return nulls when cookies property is undefined', () => {
      const mockRequest = {};

      const result = authGuard['extractTokenFromCookie'](mockRequest);

      expect(result).toEqual({
        jwtCookie: null,
        refreshTokenCookie: null,
      });
    });
  });

  describe('authGuard.checkCookie', () => {
    it('should return true when both tokens are present', () => {
      const tokens = {
        jwtCookie: 'jwt',
        refreshTokenCookie: 'tokens',
      };

      const result = authGuard['checkCookie'](tokens);

      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when token is missing', () => {
      const token = {
        jwtCookie: null,
        refreshTokenCookie: null,
      };

      expect(() => authGuard['checkCookie'](token)).toThrow(
        UnauthorizedException,
      );
    });
  });
});
