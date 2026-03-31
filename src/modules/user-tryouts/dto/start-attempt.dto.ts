import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class StartAttemptDto {
  @ApiProperty({ example: '349454e6-0bf6-4d01-833a-04990fed0833' })
  @IsNotEmpty()
  @IsUUID()
  tryoutId: string;
}
