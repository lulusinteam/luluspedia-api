import { UserTryout } from '../../domain/user-tryout';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';
import { NullableType } from '../../../../utils/types/nullable.type';

export abstract class UserTryoutRepository {
  abstract create(
    data: Omit<UserTryout, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<UserTryout>;

  abstract findAll({
    paginationOptions,
    userId,
    tryoutId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
    tryoutId?: string;
  }): Promise<[UserTryout[], number]>;

  abstract findById(id: UserTryout['id']): Promise<NullableType<UserTryout>>;

  abstract update(
    id: UserTryout['id'],
    payload: Partial<UserTryout>,
  ): Promise<UserTryout | null>;

  abstract remove(id: UserTryout['id']): Promise<void>;
}
