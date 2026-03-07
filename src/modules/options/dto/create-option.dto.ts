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
  @ApiProperty({ type: () => Question })
  @IsNotEmpty()
  question: Question;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ type: () => FileDto, required: false })
  @IsOptional()
  attachment?: FileDto | null;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  orderOverride?: number;
}
