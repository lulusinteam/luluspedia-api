import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Tryout } from '../../tryouts/domain/tryout';
import { FileDto } from '../../files/dto/file.dto';
import { DifficultyEnum, ScoringTypeEnum } from '../questions.enum';
import { CreateOptionDto } from '../../options/dto/create-option.dto';

export class CreateQuestionDto {
  @ApiProperty({ type: () => Tryout, required: false })
  @IsOptional()
  tryout?: Tryout;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  orderNumber?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: () => FileDto, required: false })
  @IsOptional()
  image?: FileDto | null;

  @ApiProperty({
    enum: DifficultyEnum,
    default: DifficultyEnum.medium,
  })
  @IsEnum(DifficultyEnum)
  @IsOptional()
  difficulty?: DifficultyEnum;

  @ApiProperty({
    enum: ScoringTypeEnum,
    default: ScoringTypeEnum.point,
  })
  @IsEnum(ScoringTypeEnum)
  @IsOptional()
  scoringType?: ScoringTypeEnum;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  points?: number;

  @ApiProperty({ type: () => CreateOptionDto, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}
