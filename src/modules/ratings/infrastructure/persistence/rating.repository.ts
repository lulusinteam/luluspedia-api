import { Rating } from '../../domain/rating';
import { NullableType } from '../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';

export abstract class RatingRepository {
  abstract create(
    data: Omit<Rating, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Rating>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Rating[]>;

  abstract findById(id: Rating['id']): Promise<NullableType<Rating>>;

  abstract update(
    id: Rating['id'],
    payload: Partial<Rating>,
  ): Promise<NullableType<Rating>>;

  abstract remove(id: Rating['id']): Promise<void>;
}
