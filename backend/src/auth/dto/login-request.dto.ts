import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'User email address',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'User password',
    required: true,
  })
  @IsNotEmpty()
  password: string;
}
