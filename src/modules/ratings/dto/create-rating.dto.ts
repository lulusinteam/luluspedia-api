import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
    example: 'cb82c2f4-6f8d-4f1b-b4a8-6f1f5e8a9d1c',
  })
  @IsNotEmpty()
  @IsUUID()
  rateableId: string;

  @ApiProperty({
    type: String,
    example: 'tryouts',
  })
  @IsNotEmpty()
  @IsString()
  rateableType: string;

  @ApiProperty({
    type: Number,
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Good tryout!',
  })
  @IsOptional()
  @IsString()
  review?: string;
}
