import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTryoutDto } from './create-tryout.dto';
import {
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  IsString,
} from 'class-validator';
import { CategoryDto } from '../../categories/dto/category.dto';
import { CreateQuestionDto } from '../../questions/dto/create-question.dto';
import { Type } from 'class-transformer';

export class UpdateTryoutDto extends PartialType(CreateTryoutDto) {
  @ApiProperty({ type: () => CategoryDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @ApiProperty({
    type: () => CreateQuestionDto,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deleteQuestionIds?: string[];
}
