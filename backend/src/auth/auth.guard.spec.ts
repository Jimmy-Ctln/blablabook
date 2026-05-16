import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: { verifyAsync: jest.Mock };

  beforeEach(async () => {
    jwtService = { verifyAsync: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  const mockContext = (cookies: Record<string, string> = {}): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ cookies }),
      }),
    }) as unknown as ExecutionContext;

  it('rejects request without jwt_cookie with UnauthorizedException', async () => {
    await expect(guard.canActivate(mockContext({}))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects request with invalid jwt_cookie with UnauthorizedException', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));

    await expect(
      guard.canActivate(mockContext({ jwt_cookie: 'malformed.token.here' })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('accepts request with valid jwt_cookie and attaches payload to request', async () => {
    const payload = { sub: 42, userRole: 'user' };
    jwtService.verifyAsync.mockResolvedValue(payload);

    const request = { cookies: { jwt_cookie: 'valid.jwt.token' } };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect((request as Record<string, unknown>).user).toEqual(payload);
  });
});
