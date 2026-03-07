import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OptionEntity } from '../entities/option.entity';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { Option } from '../../../../domain/option';
import { OptionRepository } from '../../option.repository';
import { OptionMapper } from '../mappers/option.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';

@Injectable()
export class OptionRelationalRepository implements OptionRepository {
  constructor(
    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,
  ) {}

  async create(data: Option): Promise<Option> {
    const persistenceModel = OptionMapper.toPersistence(data);
    const newEntity = await this.optionRepository.save(
      this.optionRepository.create(persistenceModel),
    );
    return OptionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Option[]> {
    const entities = await this.optionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map(entity => OptionMapper.toDomain(entity));
  }

  async findById(id: Option['id']): Promise<NullableType<Option>> {
    const entity = await this.optionRepository.findOne({
      where: { id },
    });

    return entity ? OptionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Option['id'][]): Promise<Option[]> {
    const entities = await this.optionRepository.find({
      where: { id: In(ids) },
    });

    return entities.map(entity => OptionMapper.toDomain(entity));
  }

  async update(id: Option['id'], payload: Partial<Option>): Promise<Option> {
    const entity = await this.optionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.optionRepository.save(
      this.optionRepository.create(
        OptionMapper.toPersistence({
          ...OptionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return OptionMapper.toDomain(updatedEntity);
  }

  async remove(id: Option['id']): Promise<void> {
    await this.optionRepository.delete(id);
  }
}
