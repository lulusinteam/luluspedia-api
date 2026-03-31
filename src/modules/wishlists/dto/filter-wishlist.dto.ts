import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterWishlistDto {
  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  wishlistableId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wishlistableType?: string;
}
