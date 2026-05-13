import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 42, description: 'Internal book id' })
  @IsInt()
  bookId: number;

  @ApiProperty({ example: 4, description: 'Rating between 1 and 5', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Un livre magnifique !' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  review_text: string;
}
