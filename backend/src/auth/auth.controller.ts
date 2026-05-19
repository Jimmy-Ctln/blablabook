import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import type { RequestWithUser } from './types';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { plainToInstance } from 'class-transformer';
import { CookieService } from '../security/cookie/cookie.service';
import { TokenService } from '../security/token/token.service';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly tokenService: TokenService,
  ) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('/register')
  @ApiCreatedResponse({
    description: 'User is created with password hashed.',
    type: RegisterResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'email or username is alrady in use',
  })
  async register(
    @Body() payload: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(payload);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User is logged.',
    type: LoginResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  async login(
    @Body() payload: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const user = await this.authService.login(payload);
    const jwtToken = await this.tokenService.generateJWTToken(
      user.id,
      user.role,
    );
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);
    const cookieConfig = this.cookieService.generateCookiesConfig();

    response.cookie('jwt_cookie', jwtToken, cookieConfig.jwtCookieConfig);
    response.cookie(
      'refresh_cookie',
      refreshToken,
      cookieConfig.refreshCookieConfig,
    );

    return plainToInstance(LoginResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User is logout and token is destroyed',
  })
  async logout(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Use the refresh cookie to destroy the session — no JWT required.
    // Requiring AuthGuard here would prevent logout on expired JWT, leaving
    // the refresh token alive in the DB for up to 30 days.
    const refreshToken = request.cookies?.['refresh_cookie'] as string;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    const cookieConfig = this.cookieService.generateCookiesConfig();
    response.clearCookie('jwt_cookie', cookieConfig.jwtCookieConfig);
    response.clearCookie('refresh_cookie', cookieConfig.refreshCookieConfig);

    return { message: 'Logged out successfully' };
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Access token refreshed successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is invalid or expired',
  })
  async refresh(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Extract refresh token from cookies
    const refreshToken = request.cookies?.['refresh_cookie'] as string;

    // Call service to handle refresh logic
    const rotatedTokens =
      await this.authService.refreshUserSession(refreshToken);

    // Update cookies with new tokens
    const cookieConfig = this.cookieService.generateCookiesConfig();
    response.cookie(
      'jwt_cookie',
      rotatedTokens.newJwtToken,
      cookieConfig.jwtCookieConfig,
    );
    response.cookie(
      'refresh_cookie',
      rotatedTokens.newRefreshToken,
      cookieConfig.refreshCookieConfig,
    );

    return {
      message: 'Token refreshed successfully',
      user: plainToInstance(LoginResponseDto, rotatedTokens.fullUser, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
