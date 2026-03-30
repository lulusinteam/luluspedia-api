import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { QuestionEntity } from '../entities/question.entity';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { Question } from '../../../../domain/question';
import { QuestionRepository } from '../../question.repository';
import { QuestionMapper } from '../mappers/question.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';

@Injectable()
export class QuestionRelationalRepository implements QuestionRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  async create(data: Question): Promise<Question> {
    const persistenceModel = QuestionMapper.toPersistence(data);
    const savedEntity = await this.questionRepository.save(
      this.questionRepository.create(persistenceModel),
    );

    const finalEntity = await this.findById(savedEntity.id);
    return finalEntity!;
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
    const where: any = {
      tryout: tryoutId ? { id: tryoutId } : undefined,
    };

    if (search) {
      where.content = ILike(`%${search}%`);
    }

    const [entities, total] = await this.questionRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      relations: {
        options: {
          image: true,
        },
        image: true,
        explanationImage: true,
      },
      order: {
        orderNumber: 'ASC',
        createdAt: 'ASC',
      },
    });

    return [entities.map(entity => QuestionMapper.toDomain(entity)), total];
  }

  async findById(id: Question['id']): Promise<NullableType<Question>> {
    const entity = await this.questionRepository.findOne({
      where: { id },
      relations: {
        options: {
          image: true,
        },
        image: true,
        explanationImage: true,
      },
    });

    return entity ? QuestionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Question['id'][]): Promise<Question[]> {
    const entities = await this.questionRepository.find({
      where: { id: In(ids) },
      relations: {
        options: {
          image: true,
        },
        image: true,
        explanationImage: true,
      },
    });

    return entities.map(entity => QuestionMapper.toDomain(entity));
  }

  async update(
    id: Question['id'],
    payload: Partial<Question>,
  ): Promise<Question> {
    const entity = await this.questionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.questionRepository.save(
      this.questionRepository.create(
        QuestionMapper.toPersistence({
          ...QuestionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    const finalEntity = await this.findById(updatedEntity.id);
    return finalEntity!;
  }

  async remove(id: Question['id']): Promise<void> {
    await this.questionRepository.delete(id);
  }
}
