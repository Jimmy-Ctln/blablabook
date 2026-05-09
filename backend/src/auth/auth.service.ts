import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RegisterRequestDto } from './dto/register-request.dto';
import { UserService } from '../user/user.service';
import { UserInsert } from '@/user/types/user';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { PasswordService } from '../security/password/password.service';
import { TokenService } from '../security/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async login(payload: LoginRequestDto) {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) {
      console.error('Login attempt failed');
      throw new UnauthorizedException('email or password is invalid');
    }

    const isPasswordValid = await this.passwordService.checkPassword(
      user.password,
      payload.password,
    );

    if (!isPasswordValid) {
      console.error('Login attempt failed');
      throw new UnauthorizedException('email or password is invalid');
    }

    return user;
  }

  async register(payload: RegisterRequestDto) {
    if (payload.password !== payload.confirmPassword) {
      throw new UnprocessableEntityException('password is not confirmed');
    }

    const existingUser = await this.userService.checkUserExisting(
      payload.username,
      payload.email,
    );

    if (existingUser) {
      if (existingUser.email === payload.email) {
        throw new UnprocessableEntityException('email is already in use');
      } else if (existingUser.username === payload.username) {
        throw new UnprocessableEntityException('username is already in use');
      }
    }

    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );

    const userInputData: UserInsert = {
      email: payload.email,
      password: hashedPassword,
      username: payload.username,
    };

    const userEntity = await this.userService.createUser(userInputData);
    if (!userEntity) {
      throw new InternalServerErrorException('failed to create new user');
    }

    return plainToInstance(RegisterResponseDto, userEntity, {
      excludeExtraneousValues: true,
    });
  }

  async logout(refreshToken: string): Promise<void> {
    const isDestroyToken = await this.tokenService.destroyToken(refreshToken);

    if (!isDestroyToken) {
      console.warn('refresh token not found in the db');
    }
  }

  async refreshUserSession(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    try {
      // Rotate tokens (generate new JWT and refresh token)
      const rotatedTokens = await this.tokenService.rotateTokens(refreshToken);
      return rotatedTokens;
    } catch (error) {
      console.error('Refresh token rotation failed:', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
