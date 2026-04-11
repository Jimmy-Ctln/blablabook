import { Injectable } from '@nestjs/common';
import { CookiesConfig } from './types';
import { CookieOptions } from 'express';

@Injectable()
export class CookieService {
  constructor() {}

  generateCookiesConfig(): CookiesConfig {
    // For cross-domain cookies to work (Vercel frontend to Render backend),
    // they MUST have SameSite=None and Secure=true in production.
    // Reference: https://stackoverflow.com/questions/66974669/httponly-cookies-in-cross-domain-requests-not-being-sent
    const secureProps = process.env.NODE_ENV === 'production';
    const sameSiteProps = process.env.NODE_ENV === 'production' ? 'none' : 'lax';

    const jwtCookieConfig: CookieOptions = {
      httpOnly: true,
      secure: secureProps,
      sameSite: sameSiteProps,
      path: '/',
      maxAge: 15 * 60 * 1000, // 15min
    };

    const refreshCookieConfig: CookieOptions = {
      httpOnly: true,
      secure: secureProps,
      sameSite: sameSiteProps,
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day
    };

    return {
      refreshCookieConfig,
      jwtCookieConfig,
    };
  }
}
