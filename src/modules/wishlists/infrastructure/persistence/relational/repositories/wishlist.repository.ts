import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistEntity } from '../entities/wishlist.entity';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { Wishlist } from '../../../../domain/wishlist';
import { WishlistRepository } from '../../wishlist.repository';
import { WishlistMapper } from '../mappers/wishlist.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';

@Injectable()
export class WishlistRelationalRepository implements WishlistRepository {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly repository: Repository<WishlistEntity>,
  ) {}

  async create(data: Wishlist): Promise<Wishlist> {
    const persistenceModel = WishlistMapper.toPersistence(data);
    const newEntity = await this.repository.save(
      this.repository.create(persistenceModel),
    );
    return WishlistMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Wishlist[]> {
    const entities = await this.repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map(item => WishlistMapper.toDomain(item));
  }

  async findById(id: Wishlist['id']): Promise<NullableType<Wishlist>> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? WishlistMapper.toDomain(entity) : null;
  }

  async remove(id: Wishlist['id']): Promise<void> {
    await this.repository.softDelete(id);
  }
}
