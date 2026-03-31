import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Wishlist } from '../domain/wishlist';

export class FilterWishlistDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wishlistableId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wishlistableType?: string;
}

export class SortWishlistDto {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  orderBy: keyof Wishlist;

  @ApiPropertyOptional()
  @IsString()
  order: string;
}

export class QueryWishlistDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterWishlistDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterWishlistDto)
  filters?: FilterWishlistDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortWishlistDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortWishlistDto)
  sort?: SortWishlistDto[] | null;
}
