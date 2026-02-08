import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
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
import { AuthGuard } from './auth.guard';
import { CookieService } from '../security/cookie/cookie.service';
import { TokenService } from '../security/token/token.service';

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly tokenService: TokenService,
  ) {}

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

  @Post('/logout')
  @UseGuards(AuthGuard) // add the guard for extract cookie
  @HttpCode(HttpStatus.OK) // code 200 for the logout if success
  @ApiOkResponse({
    description: 'User is logout and token is destroyed',
  })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request['refresh_token'] as string;
    await this.authService.logout(refreshToken); // destroy token

    const cookieConfig = this.cookieService.generateCookiesConfig();
    response.clearCookie('jwt_cookie', cookieConfig.jwtCookieConfig);
    response.clearCookie('refresh_cookie', cookieConfig.refreshCookieConfig);

    return { message: 'Logged out successfully' };
  }
}
