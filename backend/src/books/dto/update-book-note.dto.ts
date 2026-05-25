import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookNoteDto {
  @ApiPropertyOptional({
    example: "Je suis à la page 232, l'histoire commence à...",
    description: 'Private note about the book, or null to clear it',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  comment?: string | null;
}
