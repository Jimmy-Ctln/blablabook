import { Injectable } from '@nestjs/common';
import { CookiesConfig } from './types';
import { CookieOptions } from 'express';

@Injectable()
export class CookieService {
  constructor() {}

  generateCookiesConfig(): CookiesConfig {
    // if we set TRUE, we need to be on HTTPS, so for the dev we use false for save the cookie
    const secureProps = process.env.NODE_ENV === 'production';

    // Use 'lax' instead of 'strict' because frontend (Vercel) and backend (Render) are on different domains.
    // 'strict' blocks cookies in cross-domain requests, but 'lax' allows them when withCredentials is set (which axios has).
    const jwtCookieConfig: CookieOptions = {
      httpOnly: true,
      secure: secureProps,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15min
    };

    const refreshCookieConfig: CookieOptions = {
      httpOnly: true,
      secure: secureProps,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day
    };

    return {
      refreshCookieConfig,
      jwtCookieConfig,
    };
  }
}
