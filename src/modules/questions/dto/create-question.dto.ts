import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Tryout } from '../../tryouts/domain/tryout';
import { FileDto } from '../../files/dto/file.dto';
import { QuestionTypeEnum } from '../questions.enum';

export class CreateQuestionDto {
  @ApiProperty({ type: () => Tryout })
  @IsNotEmpty()
  tryout: Tryout;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ type: () => FileDto, required: false })
  @IsOptional()
  attachment?: FileDto | null;

  @ApiProperty({
    enum: QuestionTypeEnum,
    default: QuestionTypeEnum.multiple_choice,
  })
  @IsEnum(QuestionTypeEnum)
  @IsNotEmpty()
  questionType: QuestionTypeEnum;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  scoreWeight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  orderOverride?: number;
}
