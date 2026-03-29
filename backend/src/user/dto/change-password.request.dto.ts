import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordRequestDto {
  @ApiProperty({ example: 'OldPassword123!' })
  @IsString({ message: 'currentPassword must be a string' })
  @MinLength(8, { message: 'currentPassword must be at least 8 characters' })
  currentPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString({ message: 'newPassword must be a string' })
  @MinLength(8, { message: 'newPassword must be at least 8 characters' })
  @MaxLength(255, {
    message: 'newPassword must be shorter than 255 characters',
  })
  newPassword: string;
}
