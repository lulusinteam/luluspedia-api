import { Wishlist } from '../../domain/wishlist';
import { NullableType } from '../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';
import {
  FilterWishlistDto,
  SortWishlistDto,
} from '../../dto/query-wishlist.dto';

export abstract class WishlistRepository {
  abstract create(
    data: Omit<Wishlist, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Wishlist>;

  abstract findAllWithPagination({
    paginationOptions,
    filterOptions,
    sortOptions,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    filterOptions?: FilterWishlistDto | null;
    sortOptions?: SortWishlistDto[] | null;
    userId?: string;
  }): Promise<Wishlist[]>;

  abstract findById(id: Wishlist['id']): Promise<NullableType<Wishlist>>;

  abstract remove(id: Wishlist['id']): Promise<void>;

  abstract findOneByUserIdAndWishlistable(
    userId: string,
    wishlistableId: string,
    wishlistableType: string,
  ): Promise<NullableType<Wishlist>>;
}
