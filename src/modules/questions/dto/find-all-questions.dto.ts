import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllQuestionsDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? Number(value) : 50))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tryoutId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
