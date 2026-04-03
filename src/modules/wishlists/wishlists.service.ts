import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistRepository } from './infrastructure/persistence/wishlist.repository';
import { User } from '../users/domain/user';
import { Wishlist } from './domain/wishlist';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { FilterWishlistDto, SortWishlistDto } from './dto/query-wishlist.dto';
import { NullableType } from '../../utils/types/nullable.type';

import { NotificationsService } from '../notifications/services/notifications.service';

@Injectable()
export class WishlistsService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

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

    const wishlist = await this.wishlistRepository.create({
      user,
      wishlistableId: createWishlistDto.wishlistableId,
      wishlistableType: createWishlistDto.wishlistableType,
    });

    // Notify (Simple version - title available if we join, otherwise generic)
    this.notificationsService
      .notifyWishlistAdded(
        user.id as string,
        `${user.firstName || 'User'}`,
        'A Tryout', // Ideally fetch title, but keeping it simple as requested
      )
      .catch(e => console.error('Notification error:', e));

    return wishlist;
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
