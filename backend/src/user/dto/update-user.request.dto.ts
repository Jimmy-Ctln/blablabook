import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRequestDto {
  @ApiPropertyOptional({
    example: 'user@mail.com',
    description: 'New email address (must be unique and valid email format)',
  })
  @IsEmail({}, { message: 'email is not valid' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'NewPassword123!',
    description:
      'New password (minimum 8 characters, maximum 255, must contain uppercase, lowercase, number and special character)',
  })
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @MaxLength(255, { message: 'password must be shorter than 255 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      'password must contain uppercase, lowercase, number and special character',
  })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    example: 'toto',
    description: 'New username (maximum 100 characters)',
  })
  @IsString()
  @MaxLength(100, { message: 'username must be shorter than 100 characters' })
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    example: 'avatar1.png',
    description: 'Avatar URL or filename',
  })
  @IsString()
  @IsOptional()
  avatar_url?: string;
}
