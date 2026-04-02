import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsDate,
} from 'class-validator';
import { CategoryDto } from '../../categories/dto/category.dto';
import { FileDto } from '../../files/dto/file.dto';
import { TryoutStatusEnum } from '../tryouts.enum';
import { CreateQuestionDto } from '../../questions/dto/create-question.dto';
import { Type } from 'class-transformer';

export class CreateTryoutDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: () => CategoryDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: () => FileDto, required: false })
  @IsOptional()
  cover?: FileDto | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  coverId?: string | null;

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
  shuffleOptions?: boolean;

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
  @IsDate()
  @Type(() => Date)
  scheduledAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishedAt?: Date;

  @ApiProperty({
    type: () => CreateQuestionDto,
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
