import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for updating reading dates (readStart, readEnd) of a book in a user's list.
 * Dates should be ISO 8601 strings or null to unset them.
 */
export class UpdateBookStatusDto {
  @ApiPropertyOptional({
    example: '2025-01-15',
    description:
      'Reading start date in ISO 8601 format (YYYY-MM-DD), or null to unset',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  readStart?: string | null;

  @ApiPropertyOptional({
    example: '2025-03-20',
    description:
      'Reading end date in ISO 8601 format (YYYY-MM-DD), or null to unset',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  readEnd?: string | null;
}
