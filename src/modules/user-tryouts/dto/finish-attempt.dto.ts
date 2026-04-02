import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FinishAttemptDto {
  @ApiProperty({ example: 'uuid-attempt' })
  @IsNotEmpty()
  @IsUUID()
  userTryoutId: string;
}
