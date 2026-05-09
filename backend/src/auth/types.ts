import { Request } from 'express';
import type { JwtPayload } from 'src/security/token/types';

export type TokenExtractorData = {
  jwtCookie: string | null;
  refreshTokenCookie: string | null;
};

export interface RequestWithUser extends Request {
  user?: JwtPayload;
  refresh_token?: string | null;
}
