import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TryoutEntity } from '../entities/tryout.entity';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { Tryout } from '../../../../domain/tryout';
import { TryoutRepository } from '../../tryout.repository';
import { TryoutMapper } from '../mappers/tryout.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';

@Injectable()
export class TryoutRelationalRepository implements TryoutRepository {
  constructor(
    @InjectRepository(TryoutEntity)
    private readonly tryoutRepository: Repository<TryoutEntity>,
  ) {}

  async create(data: Tryout): Promise<Tryout> {
    const persistenceModel = TryoutMapper.toPersistence(data);
    const newEntity = await this.tryoutRepository.save(
      this.tryoutRepository.create(persistenceModel),
    );
    return TryoutMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tryout[]> {
    const entities = await this.tryoutRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map(entity => TryoutMapper.toDomain(entity));
  }

  async findById(id: Tryout['id']): Promise<NullableType<Tryout>> {
    const entity = await this.tryoutRepository.findOne({
      where: { id },
    });

    return entity ? TryoutMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Tryout['id'][]): Promise<Tryout[]> {
    const entities = await this.tryoutRepository.find({
      where: { id: In(ids) },
    });

    return entities.map(entity => TryoutMapper.toDomain(entity));
  }

  async update(id: Tryout['id'], payload: Partial<Tryout>): Promise<Tryout> {
    const entity = await this.tryoutRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.tryoutRepository.save(
      this.tryoutRepository.create(
        TryoutMapper.toPersistence({
          ...TryoutMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TryoutMapper.toDomain(updatedEntity);
  }

  async remove(id: Tryout['id']): Promise<void> {
    await this.tryoutRepository.delete(id);
  }
}
