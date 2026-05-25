import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordRequestDto {
  @ApiProperty({
    example: 'OldPassword123!',
    description: 'Current password for verification (minimum 8 characters)',
  })
  @IsString({ message: 'currentPassword must be a string' })
  @MinLength(8, { message: 'currentPassword must be at least 8 characters' })
  currentPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description:
      'New password (minimum 8 characters, maximum 255, must contain uppercase, lowercase, number and special character)',
  })
  @IsString({ message: 'newPassword must be a string' })
  @MinLength(8, { message: 'newPassword must be at least 8 characters' })
  @MaxLength(255, {
    message: 'newPassword must be shorter than 255 characters',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      'newPassword must contain uppercase, lowercase, number and special character',
  })
  newPassword: string;
}
