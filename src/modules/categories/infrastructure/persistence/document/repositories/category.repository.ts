import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategorySchemaClass } from '../entities/category.schema';
import { CategoryRepository } from '../../category.repository';
import { Category } from '../../../../domain/category';
import { CategoryMapper } from '../mappers/category.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';

@Injectable()
export class CategoryDocumentRepository implements CategoryRepository {
  constructor(
    @InjectModel(CategorySchemaClass.name)
    private readonly categoryModel: Model<CategorySchemaClass>,
  ) {}

  async create(data: Category): Promise<Category> {
    const persistenceModel = CategoryMapper.toPersistence(data);
    const createdEntity = new this.categoryModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return CategoryMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Category[]> {
    const entityObjects = await this.categoryModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map(entityObject =>
      CategoryMapper.toDomain(entityObject),
    );
  }

  async findById(id: Category['id']): Promise<NullableType<Category>> {
    const entityObject = await this.categoryModel.findById(id);
    return entityObject ? CategoryMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Category['id'][]): Promise<Category[]> {
    const entityObjects = await this.categoryModel.find({ _id: { $in: ids } });
    return entityObjects.map(entityObject =>
      CategoryMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Category['id'],
    payload: Partial<Category>,
  ): Promise<NullableType<Category>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.categoryModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.categoryModel.findOneAndUpdate(
      filter,
      CategoryMapper.toPersistence({
        ...CategoryMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? CategoryMapper.toDomain(entityObject) : null;
  }

  async remove(id: Category['id']): Promise<void> {
    await this.categoryModel.deleteOne({ _id: id });
  }
}
