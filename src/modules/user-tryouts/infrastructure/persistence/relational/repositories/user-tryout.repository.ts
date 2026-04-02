import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTryoutEntity } from '../entities/user-tryout.entity';
import { UserTryoutRepository } from '../../user-tryout.repository';
import {
  UserTryout,
  UserTryoutStatusEnum,
} from '../../../../domain/user-tryout';
import { UserTryoutMapper } from '../mappers/user-tryout.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../../utils/types/nullable.type';

import { UserAnswerEntity } from '../entities/user-answer.entity';
import { UserAnswer } from '../../../../domain/user-answer';
import { UserAnswerMapper } from '../mappers/user-answer.mapper';

@Injectable()
export class UserTryoutRelationalRepository implements UserTryoutRepository {
  constructor(
    @InjectRepository(UserTryoutEntity)
    private readonly repository: Repository<UserTryoutEntity>,
    @InjectRepository(UserAnswerEntity)
    private readonly answerRepository: Repository<UserAnswerEntity>,
  ) {}

  async create(data: UserTryout): Promise<UserTryout> {
    const persistenceModel = UserTryoutMapper.toPersistence(data);
    const newEntity = (await this.repository.save(
      this.repository.create(persistenceModel),
    )) as UserTryoutEntity;

    const reloaded = await this.repository
      .createQueryBuilder('user_tryout')
      .leftJoinAndSelect('user_tryout.user', 'user')
      .leftJoinAndSelect('user_tryout.tryout', 'tryout')
      .leftJoinAndSelect('tryout.questions', 'questions')
      .leftJoinAndSelect('user_tryout.userAnswers', 'userAnswers')
      .leftJoinAndSelect('userAnswers.question', 'userAnswerQuestion')
      .leftJoinAndSelect('userAnswers.option', 'selectedOption')
      .leftJoinAndSelect('questions.options', 'options')
      .leftJoinAndSelect('questions.image', 'questionImage')
      .leftJoinAndSelect('options.image', 'optionImage')
      .where('user_tryout.id = :id', { id: newEntity.id })
      .orderBy('questions.orderNumber', 'ASC')
      .getOne();

    return UserTryoutMapper.toDomain(reloaded!);
  }

  async findAll({
    paginationOptions,
    userId,
    tryoutId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
    tryoutId?: string;
  }): Promise<[UserTryout[], number]> {
    const query = this.repository
      .createQueryBuilder('user_tryout')
      .leftJoin('user_tryout.tryout', 'tryout')
      .leftJoin('user_tryout.userAnswers', 'userAnswers')
      .select([
        'user_tryout.id',
        'user_tryout.startTime',
        'user_tryout.endTime',
        'user_tryout.totalScore',
        'user_tryout.status',
        'user_tryout.createdAt',
        'tryout.id',
        'tryout.passScore',
      ])
      .where('user_tryout.user = :userId', { userId });

    if (tryoutId) {
      query.andWhere('user_tryout.tryout = :tryoutId', { tryoutId });
    }

    query.orderBy('user_tryout.createdAt', 'DESC');

    const [entities, count] = await query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getManyAndCount();

    return [entities.map(entity => UserTryoutMapper.toDomain(entity)), count];
  }

  async findById(id: UserTryout['id']): Promise<NullableType<UserTryout>> {
    const entity = await this.repository
      .createQueryBuilder('user_tryout')
      .leftJoinAndSelect('user_tryout.user', 'user')
      .leftJoinAndSelect('user_tryout.tryout', 'tryout')
      .leftJoinAndSelect('user_tryout.userAnswers', 'userAnswers')
      .leftJoinAndSelect('userAnswers.option', 'selectedOption')
      .leftJoinAndSelect('userAnswers.question', 'userAnswerQuestion')
      .leftJoinAndSelect('tryout.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .leftJoinAndSelect('questions.image', 'questionImage')
      .leftJoinAndSelect('options.image', 'optionImage')
      .addSelect(subQuery => {
        return subQuery
          .select('COUNT(*)', 'count')
          .from('questions', 'q')
          .where('q.tryout_id = tryout.id');
      }, 'tryout_questionCount')
      .where('user_tryout.id = :id', { id })
      .getOne();

    return entity ? UserTryoutMapper.toDomain(entity) : null;
  }

  async update(
    id: UserTryout['id'],
    payload: Partial<UserTryout>,
  ): Promise<UserTryout | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) return null;

    await this.repository.save(
      this.repository.create(
        UserTryoutMapper.toPersistence({
          ...UserTryoutMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    // Reload with relations to ensure mapper can calculate derived fields like isPassed
    return this.findById(id);
  }

  async findInProgressAttemptByUserId(
    userId: string,
  ): Promise<NullableType<UserTryout>> {
    const entity = await this.repository
      .createQueryBuilder('user_tryout')
      .leftJoinAndSelect('user_tryout.tryout', 'tryout')
      .leftJoinAndSelect('tryout.questions', 'questions')
      .leftJoinAndSelect('user_tryout.userAnswers', 'userAnswers')
      .leftJoinAndSelect('userAnswers.question', 'userAnswerQuestion')
      .leftJoinAndSelect('userAnswers.option', 'selectedOption')
      .leftJoinAndSelect('questions.options', 'options')
      .leftJoinAndSelect('questions.image', 'questionImage')
      .leftJoinAndSelect('options.image', 'optionImage')
      .where('user_tryout.user = :userId', { userId })
      .andWhere('user_tryout.status = :status', {
        status: UserTryoutStatusEnum.inProgress,
      })
      .orderBy('questions.orderNumber', 'ASC')
      .getOne();

    return entity ? UserTryoutMapper.toDomain(entity) : null;
  }

  async saveAnswer(data: {
    userTryoutId: string;
    questionId: string;
    optionId: string;
  }): Promise<void> {
    // Robust upsert using unique constraint target - handling relation objects properly
    await this.answerRepository
      .createQueryBuilder()
      .insert()
      .into(UserAnswerEntity)
      .values({
        // Use property-to-ID mapping that TypeORM's query builder handles correctly for relations
        userTryout: { id: data.userTryoutId } as any,
        question: { id: data.questionId } as any,
        option: { id: data.optionId } as any,
        updatedAt: new Date(),
      })
      .orUpdate(['option_id', 'updatedAt'], ['user_tryout_id', 'question_id'])
      .execute();
  }

  async getAnswersByAttemptId(userTryoutId: string): Promise<UserAnswer[]> {
    const entities = await this.answerRepository
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('answer.option', 'option')
      .leftJoinAndSelect('question.options', 'questionOptions') // IMPORTANT: Join options to get max possible score
      .leftJoinAndSelect('question.image', 'questionImage')
      .leftJoinAndSelect('option.image', 'optionImage')
      .where('answer.user_tryout_id = :userTryoutId', { userTryoutId })
      .getMany();

    return entities.map(entity => UserAnswerMapper.toDomain(entity));
  }

  async findExpiredAttempts(): Promise<UserTryout[]> {
    const query = this.repository
      .createQueryBuilder('user_tryout')
      .innerJoinAndSelect('user_tryout.tryout', 'tryout')
      .where('user_tryout.status = :status', {
        status: UserTryoutStatusEnum.inProgress,
      })
      .andWhere(
        "user_tryout.startTime + (tryout.duration + 5) * interval '1 minute' < NOW()",
      );

    const entities = await query.getMany();
    return entities.map(entity => UserTryoutMapper.toDomain(entity));
  }

  async remove(id: UserTryout['id']): Promise<void> {
    await this.repository.delete(id);
  }
}
