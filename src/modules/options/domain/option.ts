import { ApiProperty } from '@nestjs/swagger';
import { Question } from '../../questions/domain/question';
import { FileType } from '../../files/domain/file';

export class Option {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: () => Question })
  question: Question;

  @ApiProperty()
  text: string;

  @ApiProperty({ type: () => FileType, required: false, nullable: true })
  attachment: FileType | null;

  @ApiProperty()
  isCorrect: boolean;

  @ApiProperty({ nullable: true })
  orderOverride?: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
