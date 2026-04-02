import { ApiProperty } from '@nestjs/swagger';
import { UserTryoutStatusEnum } from '../domain/user-tryout';

export class UserTryoutResultQuestionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderNumber: number;

  @ApiProperty()
  content: string;

  @ApiProperty({ required: false, nullable: true })
  image?: string | null;

  @ApiProperty({ required: false, nullable: true })
  explanation?: string | null;

  @ApiProperty({ required: false, nullable: true })
  explanationImage?: string | null;

  @ApiProperty({ required: false, nullable: true })
  selectedOptionId?: string | null;

  @ApiProperty({ required: false, nullable: true })
  correctOptionId?: string | null;

  @ApiProperty({ enum: ['correct', 'incorrect', 'unanswered'] })
  status: 'correct' | 'incorrect' | 'unanswered';

  @ApiProperty({ isArray: true })
  options: {
    id: string;
    content: string;
    image: string | null;
    isCorrect: boolean;
    weight: number;
  }[];
}

export class UserTryoutResultResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  totalScore: number;

  @ApiProperty()
  isPassed: boolean;

  @ApiProperty()
  elapsedTimeInSeconds: number;

  @ApiProperty()
  startTime: Date;

  @ApiProperty({ required: false, nullable: true })
  endTime?: Date | null;

  @ApiProperty()
  tryoutTitle: string;

  @ApiProperty({ enum: UserTryoutStatusEnum })
  status: UserTryoutStatusEnum;

  @ApiProperty({ type: () => UserTryoutResultQuestionDto, isArray: true })
  questions: UserTryoutResultQuestionDto[];
}
