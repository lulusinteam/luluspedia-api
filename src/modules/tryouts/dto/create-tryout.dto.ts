import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Category } from '../../categories/domain/category';
import { FileDto } from '../../files/dto/file.dto';
import { TryoutStatusEnum } from '../tryouts.enum';
import { CreateQuestionDto } from '../../questions/dto/create-question.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTryoutDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: () => Category })
  @IsNotEmpty()
  category: Category;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: () => FileDto, required: false })
  @IsOptional()
  cover?: FileDto | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  duration: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isShuffled?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showResult?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showExplanation?: boolean;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  passScore?: number;

  @ApiProperty({ enum: TryoutStatusEnum, required: false })
  @IsOptional()
  @IsEnum(TryoutStatusEnum)
  status?: TryoutStatusEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  scheduledAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  publishedAt?: Date;

  @ApiProperty({
    type: () => CreateQuestionDto,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}
