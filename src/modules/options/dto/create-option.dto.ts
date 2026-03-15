import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Question } from '../../questions/domain/question';
import { FileDto } from '../../files/dto/file.dto';

export class CreateOptionDto {
  @ApiProperty({ type: () => Question, required: false })
  @IsOptional()
  question?: Question;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: () => FileDto, required: false })
  @IsOptional()
  image?: FileDto | null;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  orderNumber?: number;
}
