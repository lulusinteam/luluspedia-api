import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TryoutEntity } from '../entities/tryout.entity';
import { CategoryEntity } from '../../../../../categories/infrastructure/persistence/relational/entities/category.entity';
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
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(data: Tryout): Promise<Tryout> {
    const persistenceModel = TryoutMapper.toPersistence(data);

    // If category is provided by slug instead of UUID
    if (data.category && data.category.id) {
      if (!this.isUUID(data.category.id)) {
        const category = await this.categoryRepository.findOne({
          where: { slug: data.category.id },
        });
        if (category) {
          persistenceModel.category = category;
        }
      }
    }

    const newEntity = await this.tryoutRepository.save(
      this.tryoutRepository.create(persistenceModel),
    );

    // Reload with relations (but skip questions as they are separate)
    const finalEntity = await this.tryoutRepository.findOne({
      where: { id: newEntity.id },
      relations: {
        category: true,
        cover: true,
      },
    });

    return TryoutMapper.toDomain(finalEntity!);
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
      relations: {
        category: true,
        cover: true,
      },
    });

    return entity ? TryoutMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Tryout['id'][]): Promise<Tryout[]> {
    const entities = await this.tryoutRepository.find({
      where: { id: In(ids) },
    });

    return entities.map(entity => TryoutMapper.toDomain(entity));
  }

  async update(
    id: Tryout['id'],
    payload: Partial<Tryout>,
  ): Promise<Tryout | null> {
    const entity = await this.tryoutRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    const updatedPersistence = TryoutMapper.toPersistence({
      ...TryoutMapper.toDomain(entity),
      ...payload,
    });

    // If category is provided by slug instead of UUID
    if (payload.category && payload.category.id) {
      if (!this.isUUID(payload.category.id)) {
        const category = await this.categoryRepository.findOne({
          where: { slug: payload.category.id },
        });
        if (category) {
          updatedPersistence.category = category;
        }
      }
    }

    const updatedEntity = await this.tryoutRepository.save(
      this.tryoutRepository.create(updatedPersistence),
    );

    // Reload the entity with relations (skip questions)
    const finalEntity = await this.tryoutRepository.findOne({
      where: { id: updatedEntity.id },
      relations: {
        category: true,
        cover: true,
      },
    });

    return finalEntity ? TryoutMapper.toDomain(finalEntity) : null;
  }

  private isUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  async findAllAdmin({
    paginationOptions,
    search,
    status,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
    status?: string;
  }): Promise<[(Tryout & { questionCount: number })[], number]> {
    const query = this.tryoutRepository
      .createQueryBuilder('tryouts')
      .leftJoinAndSelect('tryouts.category', 'category')
      .leftJoinAndSelect('tryouts.cover', 'cover')
      .loadRelationCountAndMap('tryouts.questionCount', 'tryouts.questions');

    if (search) {
      query.andWhere('tryouts.title ILIKE :search', { search: `%${search}%` });
    }

    if (status) {
      query.andWhere('tryouts.status = :status', { status });
    }

    query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .orderBy('tryouts.updatedAt', 'DESC');

    const [entities, count] = await query.getManyAndCount();

    return [
      entities.map(entity => TryoutMapper.toDomain(entity)) as (Tryout & {
        questionCount: number;
      })[],
      count,
    ];
  }

  async countByStatus(): Promise<Record<string, number>> {
    const counts = await this.tryoutRepository
      .createQueryBuilder('tryouts')
      .select('tryouts.status', 'status')
      .addSelect('COUNT(tryouts.id)', 'count')
      .groupBy('tryouts.status')
      .getRawMany();

    const result: Record<string, number> = {
      all: 0,
      draft: 0,
      scheduled: 0,
      published: 0,
      archived: 0,
    };

    let total = 0;
    counts.forEach(c => {
      const count = parseInt(c.count, 10);
      result[c.status] = count;
      total += count;
    });

    result.all = total;

    return result;
  }

  async remove(id: Tryout['id']): Promise<void> {
    await this.tryoutRepository.softDelete(id);
  }
}
