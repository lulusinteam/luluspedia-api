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

  @ApiProperty()
  durationInSeconds: number;

  @ApiProperty()
  tryoutId: string;

  @ApiProperty()
  tryoutTitle: string;

  @ApiProperty({ type: [UserTryoutQuestionResponseDto], required: false })
  questions?: UserTryoutQuestionResponseDto[];
}
