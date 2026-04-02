import { ApiProperty } from '@nestjs/swagger';
import { Tryout } from '../../tryouts/domain/tryout';
import { FileType } from '../../files/domain/file';
import { DifficultyEnum, ScoringTypeEnum } from '../questions.enum';
import { Option } from '../../options/domain/option';

export class Question {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: () => Tryout, required: false })
  tryout?: Tryout;

  @ApiProperty({ type: () => Option, isArray: true, required: false })
  options?: Option[];

  @ApiProperty()
  orderNumber: number;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: () => FileType, required: false, nullable: true })
  image: FileType | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  imageId?: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  explanation: string | null;

  @ApiProperty({ type: () => FileType, required: false, nullable: true })
  explanationImage: FileType | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  explanationImageId?: string | null;

  @ApiProperty({ enum: DifficultyEnum })
  difficulty: DifficultyEnum;

  @ApiProperty({ enum: ScoringTypeEnum })
  scoringType: ScoringTypeEnum;

  @ApiProperty({ default: 0 })
  points: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
