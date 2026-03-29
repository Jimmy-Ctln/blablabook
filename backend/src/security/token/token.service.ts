import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload, RotateTokensData, TokenInsert } from './types';
import { JwtService } from '@nestjs/jwt';
import { createHmac, randomBytes } from 'node:crypto';
import { TokenRepository } from './token.respository';

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRespository: TokenRepository,
  ) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException(
        'JWT_SECRET is not defined in environment variables',
      );
    }
    this.jwtSecret = secret;
  }

  async generateJWTToken(userId: number, userRole: string) {
    const payload: JwtPayload = {
      sub: userId,
      userRole,
    };

    let jwtToken: string;
    try {
      jwtToken = await this.jwtService.signAsync(payload);
    } catch (err) {
      let errorMessage = 'failed to sign JWT token';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error('failed to sign JWT token: ', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }

    return jwtToken;
  }

  async generateRefreshToken(userId: number): Promise<string> {
    // generate random string for the refresh token => send to front
    const tokenValue = randomBytes(32).toString('hex');

    // hash token for store in db
    const hashedRefreshToken = createHmac('sha256', this.jwtSecret)
      .update(tokenValue)
      .digest('hex');

    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const tokenData: TokenInsert = {
      refresh_token: hashedRefreshToken,
      expiresAt,
      userId,
    };

    // store token in db
    const token = await this.tokenRespository.storeRefreshToken(tokenData);
    if (!token) {
      console.error('Failed to store new refresh token');
      throw new InternalServerErrorException(
        'failed to store new refresh token',
      );
    }

    return tokenValue;
  }

  async rotateTokens(refreshToken: string): Promise<RotateTokensData> {
    // hash for find token in DB
    const hashedToken = this.hashRefreshToken(refreshToken);

    // find user data with the refresh token
    const userFromDb =
      await this.tokenRespository.getUserByRefreshToken(hashedToken);
    //check if token is find in DB
    if (!userFromDb || !userFromDb.user) {
      throw new UnauthorizedException('invalid refresh token');
    }

    // Check if refresh token has expired
    const now = new Date();
    if (userFromDb.refresh_token.expiresAt < now) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const user: JwtPayload = {
      sub: userFromDb.user.id,
      userRole: userFromDb.user.role,
    };

    const newJwtToken = await this.generateJWTToken(user.sub, user.userRole);
    const newRefreshToken = await this.generateRefreshToken(user.sub);

    if (!newJwtToken) {
      throw new InternalServerErrorException(
        'failed to generate new JWT token',
      );
    }

    if (!newRefreshToken) {
      throw new InternalServerErrorException(
        'failed to generate new refresh token',
      );
    }

    // delete old refresh token
    await this.tokenRespository.destroyRefreshToken(hashedToken);

    return {
      newJwtToken,
      newRefreshToken,
      user,
    };
  }
  hashRefreshToken(refreshToken: string): string {
    return createHmac('sha256', this.jwtSecret)
      .update(refreshToken)
      .digest('hex');
  }
  async destroyToken(refreshToken: string): Promise<boolean> {
    const hashedToken = this.hashRefreshToken(refreshToken);
    return await this.tokenRespository.destroyRefreshToken(hashedToken);
  }
}
