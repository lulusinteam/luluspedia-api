import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class SyncAnswerDto {
  @ApiProperty({ example: 'uuid-attempt' })
  @IsNotEmpty()
  @IsUUID()
  userTryoutId: string;

  @ApiProperty({ example: 'uuid-question' })
  @IsNotEmpty()
  @IsUUID()
  questionId: string;

  @ApiProperty({ example: 'uuid-option', nullable: true })
  @ValidateIf(
    o => o.optionId !== null && o.optionId !== undefined && o.optionId !== '',
  )
  @IsOptional()
  @IsUUID()
  optionId: string | null;
}
