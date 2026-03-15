import { Wishlist } from '../../domain/wishlist';
import { NullableType } from '../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';

export abstract class WishlistRepository {
  abstract create(
    data: Omit<Wishlist, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Wishlist>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Wishlist[]>;

  abstract findById(id: Wishlist['id']): Promise<NullableType<Wishlist>>;

  abstract remove(id: Wishlist['id']): Promise<void>;
}
