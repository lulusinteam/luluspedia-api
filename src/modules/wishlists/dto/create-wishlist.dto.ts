import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
    example: 'cb82c2f4-6f8d-4f1b-b4a8-6f1f5e8a9d1c',
  })
  @IsNotEmpty()
  @IsUUID()
  wishlistableId: string;

  @ApiProperty({
    type: String,
    example: 'tryouts',
  })
  @IsNotEmpty()
  @IsString()
  wishlistableType: string;
}
