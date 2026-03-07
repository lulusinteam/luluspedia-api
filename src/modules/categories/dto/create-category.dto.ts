import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    example: 'Matematika Dasar',
  })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    type: String,
    example: 'matematika-dasar',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
