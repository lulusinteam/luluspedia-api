import { ApiProperty } from '@nestjs/swagger';

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
}
