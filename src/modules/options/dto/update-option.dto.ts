import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOptionDto } from './create-option.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOptionDto extends PartialType(CreateOptionDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;
}
