import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTryoutDto } from './create-tryout.dto';
import {
  IsArray,
  IsNotEmpty,
  ValidateNested,
  ArrayMinSize,
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
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
