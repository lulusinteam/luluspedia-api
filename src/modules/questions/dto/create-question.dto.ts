import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  ValidateIf,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Tryout } from '../../tryouts/domain/tryout';
import { FileDto } from '../../files/dto/file.dto';
import { DifficultyEnum, ScoringTypeEnum } from '../questions.enum';
import { CreateOptionDto } from '../../options/dto/create-option.dto';

export class CreateQuestionDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  id?: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  explanation?: string | null;

  @ApiProperty({ type: () => FileDto, required: false })
  @IsOptional()
  image?: FileDto | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  imageId?: string | null;

  @ApiProperty({ type: () => FileDto, required: false })
  @IsOptional()
  explanationImage?: FileDto | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  explanationImageId?: string | null;

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

  @ApiProperty({ required: false, nullable: true })
  @ValidateIf(o => o.scoringType === ScoringTypeEnum.point)
  @IsNotEmpty({ message: 'correctPoint is required when scoringType is point' })
  @IsNumber()
  @Min(1)
  @ValidateIf(o => o.scoringType === ScoringTypeEnum.weight)
  @IsOptional()
  correctPoint?: number | null;

  @ApiProperty({ type: () => CreateOptionDto, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}
