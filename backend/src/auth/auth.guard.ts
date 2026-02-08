import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { TokenService } from '../security/token/token.service';
import { TokenExtractorData } from './types';
import { JwtPayload, RotateTokensData } from 'src/security/token/types';
import { CookieService } from '../security/cookie/cookie.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
    private cookieService: CookieService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); // alow get objet request
    const response = context.switchToHttp().getResponse<Response>(); // allow add cookie if refresh need on response

    const tokens: TokenExtractorData = this.extractTokenFromCookie(request); // get cookie from request

    this.checkCookie(tokens);

    try {
      // check jwt token success
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        tokens.jwtCookie || '',
        {
          secret: process.env.JWT_SECRET,
        },
      );

      request['user'] = payload;
      request['refresh_token'] = tokens.refreshTokenCookie;
      return true;
    } catch (error) {
      // if expiration jwtToken and refreshToken is valid
      if (error instanceof TokenExpiredError && tokens.refreshTokenCookie) {
        // generate cookie config
        const cookieConfig = this.cookieService.generateCookiesConfig();
        // refresh tokens (jwt and refresh)
        try {
          console.log('JWT expired. Attempting auto refresh ...');
          // we refresh tokens
          const rotateToken: RotateTokensData =
            await this.tokenService.rotateTokens(tokens.refreshTokenCookie);

          // update cookie on the response
          response.cookie(
            'jwt_cookie',
            rotateToken.newJwtToken,
            cookieConfig.jwtCookieConfig,
          );
          response.cookie(
            'refresh_cookie',
            rotateToken.newRefreshToken,
            cookieConfig.refreshCookieConfig,
          );

          // update request with new cookies
          request['user'] = rotateToken.user;
          request['refresh_token'] = rotateToken.newRefreshToken;

          console.log('auto-refresh successful.');
          return true;
        } catch (refreshError) {
          // if refresh failed
          console.error('Auto-refresh failed: ', refreshError);
          // clean cookie
          response.clearCookie('jwt_cookie', cookieConfig.jwtCookieConfig);
          response.clearCookie(
            'refresh_token',
            cookieConfig.refreshCookieConfig,
          );
          throw new UnauthorizedException(
            'Session expired, please login again',
          );
        }
      }

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

  private checkCookie(tokens: TokenExtractorData): boolean {
    if (!tokens.jwtCookie || !tokens.refreshTokenCookie) {
      if (process.env.NODE_ENV === 'dev') {
        if (!tokens.jwtCookie)
          console.error('jwt cookie is missing on the request');
        if (!tokens.refreshTokenCookie)
          console.error('refresh cookie is missing on the request');
      }
      throw new UnauthorizedException('no tokens found');
    }
    return true;
  }
}
