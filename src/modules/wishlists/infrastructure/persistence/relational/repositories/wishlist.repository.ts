import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistEntity } from '../entities/wishlist.entity';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { Wishlist } from '../../../../domain/wishlist';
import { WishlistRepository } from '../../wishlist.repository';
import { WishlistMapper } from '../mappers/wishlist.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';
import {
  FilterWishlistDto,
  SortWishlistDto,
} from '../../../../dto/query-wishlist.dto';

@Injectable()
export class WishlistRelationalRepository implements WishlistRepository {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly repository: Repository<WishlistEntity>,
  ) {}

  async create(
    data: Omit<Wishlist, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Wishlist> {
    const persistenceModel = WishlistMapper.toPersistence(data as Wishlist);
    const newEntity = await this.repository.save(
      this.repository.create(persistenceModel),
    );
    return WishlistMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
    filterOptions,
    sortOptions,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    filterOptions?: FilterWishlistDto | null;
    sortOptions?: SortWishlistDto[] | null;
    userId?: string;
  }): Promise<Wishlist[]> {
    const query = this.repository.createQueryBuilder('wishlist');

    if (userId) {
      query.andWhere('wishlist.user_id = :userId', { userId });
    }

    if (filterOptions?.wishlistableId) {
      query.andWhere('wishlist.wishlistable_id = :wishlistableId', {
        wishlistableId: filterOptions.wishlistableId,
      });
    }

    if (filterOptions?.wishlistableType) {
      query.andWhere('wishlist.wishlistable_type = :wishlistableType', {
        wishlistableType: filterOptions.wishlistableType,
      });
    }

    if (sortOptions?.length) {
      sortOptions.forEach(sort => {
        query.addOrderBy(
          `wishlist.${sort.orderBy}`,
          sort.order.toUpperCase() as 'ASC' | 'DESC',
        );
      });
    } else {
      query.addOrderBy('wishlist.createdAt', 'DESC');
    }

    query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit);

    const entities = await query.getMany();

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

  async findOneByUserIdAndWishlistable(
    userId: string,
    wishlistableId: string,
    wishlistableType: string,
  ): Promise<NullableType<Wishlist>> {
    const entity = await this.repository.findOne({
      where: {
        user: { id: userId },
        wishlistableId,
        wishlistableType,
      },
    });

    return entity ? WishlistMapper.toDomain(entity) : null;
  }
}
