import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser, TokenExtractorData } from './types';
import { JwtPayload } from '@/security/token/types';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const tokens: TokenExtractorData = this.extractTokenFromCookie(request);

    this.checkJwtCookie(tokens);

    try {
      // Verify JWT token (signature and expiration)
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        tokens.jwtCookie || '',
        {
          secret: process.env.JWT_SECRET,
        },
      );

      request.user = payload;
      request.refresh_token = tokens.refreshTokenCookie;
      return true;
    } catch {
      // JWT validation failed (invalid signature or expired)
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromCookie(request: {
    cookies?: Record<string, any>;
  }): TokenExtractorData {
    const jwtCookie =
      (request.cookies?.['jwt_cookie'] as string | undefined) ?? null;
    const refreshTokenCookie =
      (request.cookies?.['refresh_cookie'] as string | undefined) ?? null;

    return {
      jwtCookie,
      refreshTokenCookie,
    };
  }

  private checkJwtCookie(tokens: TokenExtractorData): boolean {
    if (!tokens.jwtCookie) {
      if (process.env.NODE_ENV === 'dev') {
        this.logger.warn('JWT cookie is missing on the request');
      }
      throw new UnauthorizedException('No token found');
    }
    return true;
  }
}
