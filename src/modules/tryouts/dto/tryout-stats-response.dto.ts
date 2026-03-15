import { ApiProperty } from '@nestjs/swagger';

export class TryoutStatsResponseDto {
  @ApiProperty({ example: 50 })
  all: number;

  @ApiProperty({ example: 10 })
  draft: number;

  @ApiProperty({ example: 10 })
  scheduled: number;

  @ApiProperty({ example: 20 })
  published: number;

  @ApiProperty({ example: 10 })
  archived: number;
}
