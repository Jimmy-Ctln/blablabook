import { refreshToken, user } from 'src/db/schema';

export type JwtPayload = {
  sub: number;
  userRole: string;
};

export type TokenSelect = typeof refreshToken.$inferSelect;
export type TokenInsert = typeof refreshToken.$inferInsert;

export type UserJoinRefreshToken = {
  user: typeof user.$inferSelect | null;
  refresh_token: typeof refreshToken.$inferSelect;
};

export type RotateTokensData = {
  newJwtToken: string;
  newRefreshToken: string;
  user: JwtPayload;
};
