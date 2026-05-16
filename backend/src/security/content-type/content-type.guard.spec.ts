import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { JsonContentTypeGuard } from './content-type.guard';

describe('JsonContentTypeGuard', () => {
  const guard = new JsonContentTypeGuard();

  const mockContext = (
    method: string,
    headers: Record<string, string> = {},
  ): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ method, headers }),
      }),
    }) as unknown as ExecutionContext;

  it('allows GET requests regardless of Content-Type', () => {
    expect(guard.canActivate(mockContext('GET'))).toBe(true);
  });

  it('rejects POST with application/x-www-form-urlencoded (CSRF vector)', () => {
    const context = mockContext('POST', {
      'content-type': 'application/x-www-form-urlencoded',
    });
    expect(() => guard.canActivate(context)).toThrow(BadRequestException);
  });

  it('rejects POST with text/plain (CSRF vector)', () => {
    const context = mockContext('POST', { 'content-type': 'text/plain' });
    expect(() => guard.canActivate(context)).toThrow(BadRequestException);
  });

  it('accepts POST with application/json', () => {
    const context = mockContext('POST', {
      'content-type': 'application/json',
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('accepts POST with application/json; charset=utf-8', () => {
    const context = mockContext('POST', {
      'content-type': 'application/json; charset=utf-8',
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows POST with empty body (content-length: 0)', () => {
    const context = mockContext('POST', { 'content-length': '0' });
    expect(guard.canActivate(context)).toBe(true);
  });
});
