import { DeepPartial } from '../../../../utils/types/deep-partial.type';
import { NullableType } from '../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';
import { Option } from '../../domain/option';

export abstract class OptionRepository {
  abstract create(
    data: Omit<Option, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Option>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Option[]>;

  abstract findById(id: Option['id']): Promise<NullableType<Option>>;

  abstract findByIds(ids: Option['id'][]): Promise<Option[]>;

  abstract update(
    id: Option['id'],
    payload: DeepPartial<Option>,
  ): Promise<Option | null>;

  abstract remove(id: Option['id']): Promise<void>;
}
