import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
  Matches,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    example: 'user@mail.com',
    description:
      'Unique email address for account creation. Must be a valid email format.',
    required: true,
  })
  @IsEmail({}, { message: 'email is not valid' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description:
      'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.',
    minLength: 8,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'password needs 8 or more characters' })
  @MaxLength(128, { message: 'password must be shorter than 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      'password must contain uppercase, lowercase, number and special character',
  })
  password: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description:
      'Password confirmation. Must match the password field exactly.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username. Must be at least 3 characters long.',
    minLength: 3,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'username needs 3 or more characters' })
  username: string;
}
