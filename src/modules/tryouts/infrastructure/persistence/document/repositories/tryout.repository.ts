import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TryoutSchemaClass } from '../entities/tryout.schema';
import { TryoutRepository } from '../../tryout.repository';
import { Tryout } from '../../../../domain/tryout';
import { TryoutMapper } from '../mappers/tryout.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';

@Injectable()
export class TryoutDocumentRepository implements TryoutRepository {
  constructor(
    @InjectModel(TryoutSchemaClass.name)
    private readonly tryoutModel: Model<TryoutSchemaClass>,
  ) {}

  async create(data: Tryout): Promise<Tryout> {
    const persistenceModel = TryoutMapper.toPersistence(data);
    const createdEntity = new this.tryoutModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return TryoutMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tryout[]> {
    const entityObjects = await this.tryoutModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map(entityObject =>
      TryoutMapper.toDomain(entityObject),
    );
  }

  async findById(id: Tryout['id']): Promise<NullableType<Tryout>> {
    const entityObject = await this.tryoutModel
      .findById(id)
      .populate('category')
      .populate('cover')
      .populate({
        path: 'questions',
        populate: {
          path: 'options',
        },
      });
    return entityObject ? TryoutMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Tryout['id'][]): Promise<Tryout[]> {
    const entityObjects = await this.tryoutModel.find({ _id: { $in: ids } });
    return entityObjects.map(entityObject =>
      TryoutMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Tryout['id'],
    payload: Partial<Tryout>,
  ): Promise<NullableType<Tryout>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.tryoutModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.tryoutModel.findOneAndUpdate(
      filter,
      TryoutMapper.toPersistence({
        ...TryoutMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? TryoutMapper.toDomain(entityObject) : null;
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
    const filter: any = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (status) {
      filter.status = status;
    }

    const entityObjects = await this.tryoutModel
      .find(filter)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    const count = await this.tryoutModel.countDocuments(filter);

    return [
      entityObjects.map(entityObject => {
        const domain = TryoutMapper.toDomain(entityObject);
        return {
          ...domain,
          questionCount: 0, // Placeholder
        };
      }),
      count,
    ];
  }

  async countByStatus(): Promise<Record<string, number>> {
    return Promise.resolve({
      all: 0,
      draft: 0,
      scheduled: 0,
      published: 0,
      archived: 0,
    });
  }

  async findAllUser({
    paginationOptions,
    search,
    category,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
    category?: string;
    isWishlist?: boolean;
    userId?: string;
  }): Promise<[Tryout[], number]> {
    const filter: any = { status: 'published' };
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const entityObjects = await this.tryoutModel
      .find(filter)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .populate('category')
      .populate('cover');

    const count = await this.tryoutModel.countDocuments(filter);

    return [
      entityObjects.map(entityObject => {
        const domain = TryoutMapper.toDomain(entityObject);
        return {
          ...domain,
          ratingAverage: 0,
          ratingCount: 0,
          isWishlist: false,
        };
      }),
      count,
    ];
  }

  async remove(id: Tryout['id']): Promise<void> {
    await this.tryoutModel.deleteOne({ _id: id });
  }

  async autoPublishScheduled(): Promise<number> {
    const result = await this.tryoutModel.updateMany(
      {
        status: 'scheduled',
        scheduledAt: { $lte: new Date() },
      },
      {
        $set: {
          status: 'published',
          publishedAt: new Date(),
        },
      },
    );

    return result.modifiedCount;
  }

  async globalSearch(query: string): Promise<Tryout[]> {
    const filter = {
      status: 'published',
      title: { $regex: query, $options: 'i' },
    };
    const entityObjects = await this.tryoutModel
      .find(filter)
      .populate('category')
      .populate('cover');

    return entityObjects.map(entityObject =>
      TryoutMapper.toDomain(entityObject),
    );
  }
}
