import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    required: true,
    uniqueItems: true,
    example: 'user@mail.com',
  })
  @IsEmail({}, { message: 'email is not valid' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8, { message: 'password need 8 or more caracteres' })
  password: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    required: true,
    uniqueItems: true,
  })
  @IsNotEmpty()
  username: string;
}
