import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsUUID } from 'class-validator';

export class FindMyAttemptsDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  tryoutId?: string;
}
