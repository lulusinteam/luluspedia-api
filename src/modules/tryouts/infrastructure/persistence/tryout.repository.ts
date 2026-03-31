import { DeepPartial } from '../../../../utils/types/deep-partial.type';
import { NullableType } from '../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';
import { Tryout } from '../../domain/tryout';

export abstract class TryoutRepository {
  abstract create(
    data: Omit<Tryout, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Tryout>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tryout[]>;

  abstract findById(id: Tryout['id']): Promise<NullableType<Tryout>>;

  abstract findByIdUser(
    id: Tryout['id'],
    userId: string,
  ): Promise<NullableType<Tryout>>;

  abstract findByIds(ids: Tryout['id'][]): Promise<Tryout[]>;

  abstract update(
    id: Tryout['id'],
    payload: DeepPartial<Tryout>,
  ): Promise<Tryout | null>;

  abstract findAllAdmin({
    paginationOptions,
    search,
    status,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
    status?: string;
  }): Promise<[(Tryout & { questionCount: number })[], number]>;

  abstract findAllUser({
    paginationOptions,
    search,
    category,
    isWishlist,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
    category?: string;
    isWishlist?: boolean;
    userId?: string;
  }): Promise<[Tryout[], number]>;

  abstract countByStatus(): Promise<Record<string, number>>;

  abstract remove(id: Tryout['id']): Promise<void>;

  abstract autoPublishScheduled(): Promise<number>;

  abstract globalSearch(query: string): Promise<Tryout[]>;
}
