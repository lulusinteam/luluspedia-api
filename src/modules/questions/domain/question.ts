import { ApiProperty } from '@nestjs/swagger';
import { Tryout } from '../../tryouts/domain/tryout';
import { FileType } from '../../files/domain/file';
import { QuestionTypeEnum } from '../questions.enum';

export class Question {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: () => Tryout })
  tryout: Tryout;

  @ApiProperty()
  text: string;

  @ApiProperty({ type: () => FileType, required: false, nullable: true })
  attachment: FileType | null;

  @ApiProperty({ enum: QuestionTypeEnum })
  questionType: string;

  @ApiProperty()
  scoreWeight: number;

  @ApiProperty()
  explanation: string;

  @ApiProperty({ nullable: true })
  orderOverride?: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
