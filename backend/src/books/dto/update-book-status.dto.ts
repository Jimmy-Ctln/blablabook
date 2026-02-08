import { IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating reading dates (readStart, readEnd) of a book in a user's list.
 * Dates should be ISO 8601 strings or null to unset them.
 */
export class UpdateBookStatusDto {
  @IsOptional()
  @IsString()
  readStart?: string | null;

  @IsOptional()
  @IsString()
  readEnd?: string | null;
}
