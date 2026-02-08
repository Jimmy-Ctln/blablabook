import { CookieOptions } from 'express';

export type CookiesConfig = {
  jwtCookieConfig: CookieOptions;
  refreshCookieConfig: CookieOptions;
};
