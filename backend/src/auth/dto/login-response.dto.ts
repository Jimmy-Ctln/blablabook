import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
export class LoginResponseDto {
  @ApiProperty({ description: 'unique identicate for user', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'user email',
    example: 'dwitch-scrutz@dander-muffin.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'username',
    example: 'dwithScrutz',
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: 'user role',
    enum: ['USER', 'ADMIN'],
    example: 'USER',
  })
  @Expose()
  role: string;

  @ApiProperty({
    description: 'url profil image',
    example: 'https://image_url.com/image_89.jepg',
  })
  @Expose()
  image: string | null;

  @Exclude()
  password?: string;

  @Exclude()
  createdAt?: Date;

  @Exclude()
  updatedAt?: Date;

  @Exclude()
  deletedAt?: Date | null;
}
