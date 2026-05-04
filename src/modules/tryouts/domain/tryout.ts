import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/domain/category';
import { FileType } from '../../files/domain/file';
import { Question } from '../../questions/domain/question';

export class Tryout {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: () => Category })
  category: Category;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: () => FileType, nullable: true })
  cover: FileType | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  coverId?: string | null;

  @ApiProperty()
  isRecommended: boolean;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  shuffleOptions: boolean;

  @ApiProperty()
  showResult: boolean;

  @ApiProperty()
  showExplanation: boolean;

  @ApiProperty()
  passScore: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  scheduledAt?: Date;

  @ApiProperty()
  publishedAt?: Date;

  @ApiProperty({ type: () => Question, isArray: true, required: false })
  questions?: Question[];

  @ApiProperty({ type: String, isArray: true, required: false })
  deleteQuestionIds?: string[];

  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  questionCount?: number;

  @ApiProperty()
  ratingAverage?: number;

  @ApiProperty()
  ratingCount?: number;

  @ApiProperty()
  isWishlist?: boolean;
}
