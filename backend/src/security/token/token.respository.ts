import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { TokenInsert, TokenSelect, UserJoinRefreshToken } from './types';
import { eq } from 'drizzle-orm';

@Injectable()
export class TokenRepository {
  constructor(
    @Inject('DRIZZLE') private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getUserByRefreshToken(
    hashedToken: string,
  ): Promise<UserJoinRefreshToken | null> {
    const result = await this.db
      .select()
      .from(schema.refreshToken)
      .leftJoin(schema.user, eq(schema.refreshToken.userId, schema.user.id))
      .where(eq(schema.refreshToken.token, hashedToken));
    return result[0] ?? null;
  }

  async destroyRefreshToken(token: string): Promise<boolean> {
    await this.db
      .delete(schema.refreshToken)
      .where(eq(schema.refreshToken.token, token));
    return true; //si détruit on retourne true
  }

  async storeRefreshToken(payload: TokenInsert): Promise<TokenSelect | null> {
    const result = await this.db
      .insert(schema.refreshToken)
      .values(payload)
      .returning();
    return result[0] ?? null;
  }
}
