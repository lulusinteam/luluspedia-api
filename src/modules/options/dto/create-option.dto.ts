import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Question } from '../../questions/domain/question';
import { FileDto } from '../../files/dto/file.dto';

export class CreateOptionDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ type: () => Question, required: false })
  @IsOptional()
  question?: Question;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  content?: string | null;

  @ApiProperty({ type: () => FileDto, required: false })
  @IsOptional()
  image?: FileDto | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  imageId?: string | null;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  orderNumber?: number;
}
