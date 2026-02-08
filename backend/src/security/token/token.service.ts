import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload, RotateTokensData, TokenInsert } from './types';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import { TokenRepository } from './token.respository';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRespository: TokenRepository,
  ) {}

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
    const hashedRefreshToken = createHash('sha256')
      .update(tokenValue)
      .digest('hex');

    const tokenData: TokenInsert = {
      token: hashedRefreshToken,
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
      throw new UnauthorizedException('invalide refresh token');
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

  async destroyToken(refreshToken: string): Promise<boolean> {
    const hashedToken = this.hashRefreshToken(refreshToken);
    return await this.tokenRespository.destroyRefreshToken(hashedToken);
  }

  hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }
}
