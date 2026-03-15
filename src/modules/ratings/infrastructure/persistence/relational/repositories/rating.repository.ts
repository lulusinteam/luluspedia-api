import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingEntity } from '../entities/rating.entity';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { Rating } from '../../../../domain/rating';
import { RatingRepository } from '../../rating.repository';
import { RatingMapper } from '../mappers/rating.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';

@Injectable()
export class RatingRelationalRepository implements RatingRepository {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly repository: Repository<RatingEntity>,
  ) {}

  async create(data: Rating): Promise<Rating> {
    const persistenceModel = RatingMapper.toPersistence(data);
    const newEntity = await this.repository.save(
      this.repository.create(persistenceModel),
    );
    return RatingMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Rating[]> {
    const entities = await this.repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map(item => RatingMapper.toDomain(item));
  }

  async findById(id: Rating['id']): Promise<NullableType<Rating>> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? RatingMapper.toDomain(entity) : null;
  }

  async update(id: Rating['id'], payload: Partial<Rating>): Promise<Rating> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Rating not found');
    }

    const updatedEntity = await this.repository.save(
      this.repository.create(
        RatingMapper.toPersistence({
          ...RatingMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RatingMapper.toDomain(updatedEntity);
  }

  async remove(id: Rating['id']): Promise<void> {
    await this.repository.softDelete(id);
  }
}
