import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRequestDto {
  @ApiPropertyOptional({ example: 'user@mail.com' })
  @IsEmail({}, { message: 'email is not valid' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Password123!' })
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @MaxLength(255, { message: 'password must be shorter than 255 characters' })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: 'titi' })
  @IsString()
  @MaxLength(100, { message: 'username must be shorter than 100 characters' })
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: 'avatar1.png' })
  @IsString()
  @IsOptional()
  avatar_url?: string;
}
