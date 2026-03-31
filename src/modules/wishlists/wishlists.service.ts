import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistRepository } from './infrastructure/persistence/wishlist.repository';
import { User } from '../users/domain/user';
import { Wishlist } from './domain/wishlist';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { FilterWishlistDto, SortWishlistDto } from './dto/query-wishlist.dto';
import { NullableType } from '../../utils/types/nullable.type';

@Injectable()
export class WishlistsService {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist | void> {
    const existing =
      await this.wishlistRepository.findOneByUserIdAndWishlistable(
        user.id as string,
        createWishlistDto.wishlistableId,
        createWishlistDto.wishlistableType,
      );

    if (existing) {
      return this.wishlistRepository.remove(existing.id);
    }

    return this.wishlistRepository.create({
      user,
      wishlistableId: createWishlistDto.wishlistableId,
      wishlistableType: createWishlistDto.wishlistableType,
    });
  }

  findAllWithPagination({
    paginationOptions,
    filterOptions,
    sortOptions,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    filterOptions?: FilterWishlistDto | null;
    sortOptions?: SortWishlistDto[] | null;
    userId?: string;
  }): Promise<Wishlist[]> {
    return this.wishlistRepository.findAllWithPagination({
      paginationOptions,
      filterOptions,
      sortOptions,
      userId,
    });
  }

  findById(id: Wishlist['id']): Promise<NullableType<Wishlist>> {
    return this.wishlistRepository.findById(id);
  }

  async remove(id: Wishlist['id']): Promise<void> {
    await this.wishlistRepository.remove(id);
  }
}
