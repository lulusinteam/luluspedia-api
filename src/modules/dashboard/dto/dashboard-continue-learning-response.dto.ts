import { ApiProperty } from '@nestjs/swagger';

export class DashboardContinueLearningResponseDto {
  @ApiProperty()
  userTryoutId: string;

  @ApiProperty()
  tryoutId: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  currentSubtest?: string | null;

  @ApiProperty({ example: 45 })
  progressPercentage: number;

  @ApiProperty({ example: 3600 })
  remainingSeconds: number;

  @ApiProperty({ required: false, nullable: true })
  cover?: string | null;
}
