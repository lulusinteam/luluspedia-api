import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionSchemaClass } from '../entities/question.schema';
import { QuestionRepository } from '../../question.repository';
import { Question } from '../../../../domain/question';
import { QuestionMapper } from '../mappers/question.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';

@Injectable()
export class QuestionDocumentRepository implements QuestionRepository {
  constructor(
    @InjectModel(QuestionSchemaClass.name)
    private readonly questionModel: Model<QuestionSchemaClass>,
  ) {}

  async create(data: Question): Promise<Question> {
    const persistenceModel = QuestionMapper.toPersistence(data);
    const createdEntity = new this.questionModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return QuestionMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
    tryoutId,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    tryoutId?: string;
    search?: string;
  }): Promise<[Question[], number]> {
    const filter: any = {};
    if (tryoutId) {
      filter['tryout._id'] = tryoutId;
    }
    if (search) {
      filter['content'] = { $regex: search, $options: 'i' };
    }

    const [entityObjects, total] = await Promise.all([
      this.questionModel
        .find(filter)
        .skip((paginationOptions.page - 1) * paginationOptions.limit)
        .limit(paginationOptions.limit),
      this.questionModel.countDocuments(filter),
    ]);

    return [
      entityObjects.map(entityObject => QuestionMapper.toDomain(entityObject)),
      total,
    ];
  }

  async findById(id: Question['id']): Promise<NullableType<Question>> {
    const entityObject = await this.questionModel.findById(id);
    return entityObject ? QuestionMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Question['id'][]): Promise<Question[]> {
    const entityObjects = await this.questionModel.find({ _id: { $in: ids } });
    return entityObjects.map(entityObject =>
      QuestionMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Question['id'],
    payload: Partial<Question>,
  ): Promise<NullableType<Question>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.questionModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.questionModel.findOneAndUpdate(
      filter,
      QuestionMapper.toPersistence({
        ...QuestionMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? QuestionMapper.toDomain(entityObject) : null;
  }

  async remove(id: Question['id']): Promise<void> {
    await this.questionModel.deleteOne({ _id: id });
  }
}
