import { ApiProperty } from '@nestjs/swagger';
import { Question } from '../../questions/domain/question';
import { FileType } from '../../files/domain/file';

export class Option {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: () => Question, required: false })
  question?: Question;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: () => FileType, required: false, nullable: true })
  image: FileType | null;

  @ApiProperty()
  isCorrect: boolean;

  @ApiProperty()
  orderNumber?: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
