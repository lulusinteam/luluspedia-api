import { ApiProperty } from '@nestjs/swagger';

export class UserTryoutOptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ nullable: true })
  image?: string | null;
}

export class UserTryoutQuestionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderNumber: number;

  @ApiProperty()
  content: string;

  @ApiProperty({ nullable: true })
  image?: string | null;

  @ApiProperty({ enum: ['point', 'weight'] })
  scoringType: 'point' | 'weight';

  @ApiProperty({ nullable: true })
  selectedOptionId?: string | null;

  @ApiProperty({ type: [UserTryoutOptionResponseDto] })
  options: UserTryoutOptionResponseDto[];
}

export class UserTryoutResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  totalScore: number;

  @ApiProperty()
  isPassed: boolean;

  @ApiProperty({
    description: 'Total duration allowed for this tryout in minutes',
  })
  tryoutDuration: number;

  @ApiProperty({ description: 'Total duration allowed in seconds' })
  totalDurationInSeconds: number;

  @ApiProperty()
  tryoutId: string;

  @ApiProperty()
  tryoutTitle: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ description: 'Actual time taken in seconds' })
  elapsedTimeInSeconds: number;

  @ApiProperty({ type: [UserTryoutQuestionResponseDto], required: false })
  questions?: UserTryoutQuestionResponseDto[];
}
