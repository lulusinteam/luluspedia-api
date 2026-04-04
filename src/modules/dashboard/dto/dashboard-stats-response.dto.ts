import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsResponseDto {
  @ApiProperty({ example: 90 })
  finishedPercentage: number;

  @ApiProperty({ example: 45 })
  completedCount: number;

  @ApiProperty({ example: 50 })
  availableCount: number;

  @ApiProperty({ example: 124 })
  userRank: number;

  @ApiProperty({ example: 78 })
  bestScore: number;
}
