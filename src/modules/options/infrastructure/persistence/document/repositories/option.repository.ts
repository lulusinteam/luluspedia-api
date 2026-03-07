import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OptionSchemaClass } from '../entities/option.schema';
import { OptionRepository } from '../../option.repository';
import { Option } from '../../../../domain/option';
import { OptionMapper } from '../mappers/option.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';

@Injectable()
export class OptionDocumentRepository implements OptionRepository {
  constructor(
    @InjectModel(OptionSchemaClass.name)
    private readonly optionModel: Model<OptionSchemaClass>,
  ) {}

  async create(data: Option): Promise<Option> {
    const persistenceModel = OptionMapper.toPersistence(data);
    const createdEntity = new this.optionModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return OptionMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Option[]> {
    const entityObjects = await this.optionModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map(entityObject =>
      OptionMapper.toDomain(entityObject),
    );
  }

  async findById(id: Option['id']): Promise<NullableType<Option>> {
    const entityObject = await this.optionModel.findById(id);
    return entityObject ? OptionMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Option['id'][]): Promise<Option[]> {
    const entityObjects = await this.optionModel.find({ _id: { $in: ids } });
    return entityObjects.map(entityObject =>
      OptionMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Option['id'],
    payload: Partial<Option>,
  ): Promise<NullableType<Option>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.optionModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.optionModel.findOneAndUpdate(
      filter,
      OptionMapper.toPersistence({
        ...OptionMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? OptionMapper.toDomain(entityObject) : null;
  }

  async remove(id: Option['id']): Promise<void> {
    await this.optionModel.deleteOne({ _id: id });
  }
}
