import { ApiProperty } from '@nestjs/swagger';

export class DashboardRecommendationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  cover?: string | null;

  @ApiProperty()
  questionCount: number;

  @ApiProperty()
  categoryLabel: string;
}

export class DashboardScoreAnalysisResponseDto {
  @ApiProperty()
  tryoutTitle: string;

  @ApiProperty({ example: 85 })
  score: number;
}

export class DashboardStudyTimeResponseDto {
  @ApiProperty()
  categoryLabel: string;

  @ApiProperty({ example: 46 })
  durationInHours: number;

  @ApiProperty({ example: 60 })
  durationPercentage: number;
}

export class DashboardLeaderboardEntryDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty({ required: false, nullable: true })
  userPhoto?: string | null;

  @ApiProperty()
  totalScore: number;

  @ApiProperty()
  rank: number;
}

export class DashboardLeaderboardResponseDto {
  @ApiProperty({ type: [DashboardLeaderboardEntryDto] })
  topPlayers: DashboardLeaderboardEntryDto[];

  @ApiProperty({ type: DashboardLeaderboardEntryDto, required: false, nullable: true })
  currentUser?: DashboardLeaderboardEntryDto | null;
}
