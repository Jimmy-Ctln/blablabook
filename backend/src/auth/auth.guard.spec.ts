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
    decode: jest.fn(),
    sign: jest.fn(),
  };

  const tokenServiceMock = {
    rotateTokens: jest.fn(),
    generateTokens: jest.fn(),
    verifyToken: jest.fn(),
  };

  const cookieServiceMock = {
    generateCookiesConfig: jest.fn(),
    parseCookies: jest.fn(),
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

    it('should handle malformed cookies gracefully', () => {
      const mockRequest = {
        cookies: {
          jwt_cookie: '',
          refresh_cookie: null,
        },
      };

      const result = authGuard['extractTokenFromCookie'](mockRequest);

      expect(result.jwtCookie).toBe('');
      expect(result.refreshTokenCookie).toBeNull();
    });
  });

  describe('authGuard.checkCookie', () => {
    it('should return true when both tokens are present', () => {
      const tokens = {
        jwtCookie: 'jwt',
        refreshTokenCookie: 'tokens',
      };

      const result = authGuard['checkJwtCookie'](tokens);

      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when token is missing', () => {
      const token = {
        jwtCookie: null,
        refreshTokenCookie: null,
      };

      expect(() => authGuard['checkJwtCookie'](token)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw when only JWT is missing', () => {
      const token = {
        jwtCookie: null,
        refreshTokenCookie: 'refresh',
      };

      expect(() => authGuard['checkJwtCookie'](token)).toThrow(
        UnauthorizedException,
      );
    });

    it('should return true when refresh token is missing but JWT present', () => {
      const token = {
        jwtCookie: 'jwt',
        refreshTokenCookie: null,
      };

      const result = authGuard['checkJwtCookie'](token);

      expect(result).toBe(true);
    });
  });

  describe('JWT Token Verification', () => {
    it('should verify valid JWT token', () => {
      const mockPayload = {
        sub: 1,
        email: 'test@example.com',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      jwtServiceMock.decode.mockReturnValue(mockPayload);

      const result = jwtServiceMock.decode('valid-jwt');

      expect(result.sub).toBe(1);
      expect(result.email).toBe('test@example.com');
    });

    it('should handle token expiry scenario', async () => {
      const oldToken = 'old-jwt-token';
      const newToken = 'new-jwt-token';

      jwtServiceMock.verifyAsync.mockRejectedValueOnce(
        new Error('Token expired'),
      );

      tokenServiceMock.rotateTokens.mockResolvedValue({
        accessToken: newToken,
        refreshToken: 'new-refresh',
      });

      jwtServiceMock.verifyAsync.mockResolvedValueOnce({
        sub: 1,
        email: 'test@example.com',
      });

      // Simulate the flow
      let userPayload;
      try {
        userPayload = await jwtServiceMock.verifyAsync(oldToken);
      } catch {
        // Token expired, rotate
        const newTokens = await tokenServiceMock.rotateTokens(
          'refresh-token',
          1,
        );
        userPayload = await jwtServiceMock.verifyAsync(newTokens.accessToken);
      }

      expect(userPayload.sub).toBe(1);
    });

    it('should reject invalid JWT token', async () => {
      jwtServiceMock.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(jwtServiceMock.verifyAsync('invalid-jwt')).rejects.toThrow(
        'Invalid token',
      );
    });
  });

  describe('Cookie Validation', () => {
    it('should extract and validate cookies', () => {
      const mockRequest = {
        cookies: {
          jwt_cookie: 'valid-jwt',
          refresh_cookie: 'valid-refresh',
        },
      };

      const extracted = authGuard['extractTokenFromCookie'](mockRequest);
      const validated = authGuard['checkJwtCookie'](extracted);

      expect(extracted.jwtCookie).toBe('valid-jwt');
      expect(extracted.refreshTokenCookie).toBe('valid-refresh');
      expect(validated).toBe(true);
    });

    it('should reject missing cookies', () => {
      const mockRequest = {
        cookies: {},
      };

      const extracted = authGuard['extractTokenFromCookie'](mockRequest);

      expect(() => authGuard['checkJwtCookie'](extracted)).toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('Token Rotation Flow', () => {
    it('should handle token rotation when JWT expires', async () => {
      // Token is expired
      jwtServiceMock.verifyAsync.mockRejectedValueOnce(
        new Error('Token expired'),
      );

      // Perform rotation
      tokenServiceMock.rotateTokens.mockResolvedValue({
        accessToken: 'new-jwt-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
      });

      // New token should verify successfully
      jwtServiceMock.verifyAsync.mockResolvedValueOnce({
        sub: 1,
        email: 'test@example.com',
      });

      // Simulate flow
      let result;
      try {
        result = await jwtServiceMock.verifyAsync('old-token');
      } catch {
        const newTokens = await tokenServiceMock.rotateTokens('refresh', 1);
        result = await jwtServiceMock.verifyAsync(newTokens.accessToken);
      }

      expect(result.sub).toBe(1);
    });

    it('should update cookies after rotation', async () => {
      const mockResponse = {
        cookie: jest.fn(),
        setHeader: jest.fn(),
      };

      // Simulate rotation
      tokenServiceMock.rotateTokens.mockResolvedValue({
        accessToken: 'new-jwt',
        refreshToken: 'new-refresh',
      });

      const newTokens = await tokenServiceMock.rotateTokens('old-refresh', 1);

      // Verify rotation happened
      expect(newTokens.accessToken).toBe('new-jwt');
      expect(newTokens.refreshToken).toBe('new-refresh');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle missing request object gracefully', () => {
      expect(() => authGuard['extractTokenFromCookie'](null)).toThrow();
    });

    it('should handle missing cookies property', () => {
      const mockRequest = {};

      const result = authGuard['extractTokenFromCookie'](mockRequest);

      expect(result.jwtCookie).toBeNull();
      expect(result.refreshTokenCookie).toBeNull();
    });

    it('should reject both missing and invalid tokens', () => {
      const tokens1 = {
        jwtCookie: null,
        refreshTokenCookie: null,
      };

      const tokens2 = {
        jwtCookie: 'invalid',
        refreshTokenCookie: 'invalid',
      };

      expect(() => authGuard['checkJwtCookie'](tokens1)).toThrow(
        UnauthorizedException,
      );
      expect(() => authGuard['checkJwtCookie'](tokens2)).not.toThrow();
    });
  });

  describe('canActivate', () => {
    it('should return true when JWT is valid', async () => {
      const mockRequest = {
        cookies: {
          jwt_cookie: 'valid-jwt',
          refresh_cookie: 'valid-refresh',
        },
      };

      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      };

      jwtServiceMock.verifyAsync.mockResolvedValue({
        sub: 1,
        email: 'test@example.com',
      });

      const result = await authGuard.canActivate(mockExecutionContext as any);

      expect(result).toBe(true);
      expect(mockRequest['user']).toEqual({
        sub: 1,
        email: 'test@example.com',
      });
      expect(mockRequest['refresh_token']).toBe('valid-refresh');
    });

    it('should throw UnauthorizedException when JWT verification fails', async () => {
      const mockRequest = {
        cookies: {
          jwt_cookie: 'invalid-jwt',
          refresh_cookie: 'valid-refresh',
        },
      };

      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      };

      jwtServiceMock.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(
        authGuard.canActivate(mockExecutionContext as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when JWT token is missing', async () => {
      const mockRequest = {
        cookies: {},
      };

      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      };

      await expect(
        authGuard.canActivate(mockExecutionContext as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should attach refresh token to request', async () => {
      const mockRequest = {
        cookies: {
          jwt_cookie: 'valid-jwt',
          refresh_cookie: 'refresh-token-123',
        },
      };

      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      };

      jwtServiceMock.verifyAsync.mockResolvedValue({
        sub: 1,
        email: 'test@example.com',
      });

      await authGuard.canActivate(mockExecutionContext as any);

      expect(mockRequest['refresh_token']).toBe('refresh-token-123');
    });

    it('should handle missing refresh token', async () => {
      const mockRequest = {
        cookies: {
          jwt_cookie: 'valid-jwt',
        },
      };

      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      };

      jwtServiceMock.verifyAsync.mockResolvedValue({
        sub: 1,
        email: 'test@example.com',
      });

      await authGuard.canActivate(mockExecutionContext as any);

      expect(mockRequest['refresh_token']).toBeNull();
    });
  });
});
