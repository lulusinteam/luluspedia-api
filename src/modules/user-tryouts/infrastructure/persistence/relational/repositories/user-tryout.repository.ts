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
      .leftJoinAndSelect('questions.options', 'options')
      .leftJoinAndSelect('questions.image', 'questionImage')
      .leftJoinAndSelect('options.image', 'optionImage')
      .where('user_tryout.id = :id', { id: newEntity.id })
      .orderBy('questions.orderNumber', 'ASC')
      .getOne();

    if (reloaded) {
      reloaded.userAnswers = await this.answerRepository.find({
        where: { userTryout: { id: reloaded.id } },
        relations: ['option', 'question'],
      });
    }

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
        'tryout.title',
        'tryout.duration',
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

    if (entity) {
      entity.userAnswers = await this.answerRepository.find({
        where: { userTryout: { id: entity.id } },
        relations: ['option', 'question'],
      });
    }

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
      .leftJoinAndSelect('questions.options', 'options')
      .leftJoinAndSelect('questions.image', 'questionImage')
      .leftJoinAndSelect('options.image', 'optionImage')
      .where('user_tryout.user_id = :userId', { userId })
      .andWhere('user_tryout.status = :status', {
        status: UserTryoutStatusEnum.inProgress,
      })
      .orderBy('questions.orderNumber', 'ASC')
      .getOne();

    if (entity) {
      entity.userAnswers = await this.answerRepository.find({
        where: { userTryout: { id: entity.id } },
        relations: ['option', 'question'],
      });
    }

    return entity ? UserTryoutMapper.toDomain(entity) : null;
  }

  async saveAnswer(data: {
    userTryoutId: string;
    questionId: string;
    optionId: string | null;
    isCorrectSnapshot?: boolean;
    weightSnapshot?: number;
    pointsSnapshot?: number;
    questionSnapshot?: any;
    optionSnapshot?: any;
  }): Promise<void> {
    if (!data.optionId) {
      // Unselect: Remove the answer record
      await this.answerRepository.delete({
        userTryout: { id: data.userTryoutId },
        question: { id: data.questionId },
      });
      return;
    }

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
        isCorrectSnapshot: data.isCorrectSnapshot,
        weightSnapshot: data.weightSnapshot,
        pointsSnapshot: data.pointsSnapshot,
        questionSnapshot: data.questionSnapshot,
        optionSnapshot: data.optionSnapshot,
        updatedAt: new Date(),
      })
      .orUpdate(
        [
          'option_id',
          'is_correct_snapshot',
          'weight_snapshot',
          'points_snapshot',
          'question_snapshot',
          'option_snapshot',
          'updatedAt',
        ],
        ['user_tryout_id', 'question_id'],
      )
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

  async countUserCompletedTryouts(userId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('user_tryout')
      .select('COUNT(DISTINCT user_tryout.tryout_id)', 'count')
      .where('user_tryout.user_id = :userId', { userId })
      .andWhere('user_tryout.status = :status', {
        status: UserTryoutStatusEnum.completed,
      })
      .getRawOne();

    return result?.count ? Number(result.count) : 0;
  }

  async getBestScore(userId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('user_tryout')
      .select('MAX(user_tryout.totalScore)', 'maxScore')
      .where('user_tryout.user_id = :userId', { userId })
      .andWhere('user_tryout.status = :status', {
        status: UserTryoutStatusEnum.completed,
      })
      .getRawOne();

    return result?.maxScore ? Number(result.maxScore) : 0;
  }

  async getAverageScoreByCategory(
    userId: string,
  ): Promise<
    { categoryId: string; categoryLabel: string; averageScore: number }[]
  > {
    const raw = await this.repository
      .createQueryBuilder('user_tryout')
      .innerJoin('user_tryout.tryout', 'tryout')
      .innerJoin('tryout.category', 'category')
      .select([
        'category.id as "categoryId"',
        'category.label as "categoryLabel"',
        'AVG(user_tryout.totalScore) as "averageScore"',
      ])
      .where('user_tryout.user_id = :userId', { userId })
      .andWhere('user_tryout.status = :status', {
        status: UserTryoutStatusEnum.completed,
      })
      .groupBy('category.id')
      .addGroupBy('category.label')
      .getRawMany();

    return raw.map(item => ({
      categoryId: item.categoryId,
      categoryLabel: item.categoryLabel,
      averageScore: Math.round(Number(item.averageScore)),
    }));
  }

  async getStudyTimeByCategory(
    userId: string,
  ): Promise<
    { categoryId: string; categoryLabel: string; totalSeconds: number }[]
  > {
    const raw = await this.repository
      .createQueryBuilder('user_tryout')
      .innerJoin('user_tryout.tryout', 'tryout')
      .innerJoin('tryout.category', 'category')
      .select([
        'category.id as "categoryId"',
        'category.label as "categoryLabel"',
        'SUM(EXTRACT(EPOCH FROM (user_tryout.endTime - user_tryout.startTime))) as "totalSeconds"',
      ])
      .where('user_tryout.user_id = :userId', { userId })
      .andWhere('user_tryout.status = :status', {
        status: UserTryoutStatusEnum.completed,
      })
      .groupBy('category.id')
      .addGroupBy('category.label')
      .getRawMany();

    return raw.map(item => ({
      categoryId: item.categoryId,
      categoryLabel: item.categoryLabel,
      totalSeconds: Number(item.totalSeconds),
    }));
  }

  async getLeaderboard(
    limit: number,
    categoryId?: string,
  ): Promise<
    {
      userId: string;
      userName: string;
      userPhoto?: string;
      totalScore: number;
      rank: number;
    }[]
  > {
    const leaderboardQuery = this.repository.manager.query(
      `
      SELECT 
        u.id as "userId", 
        u.first_name as "firstName", 
        u.last_name as "lastName", 
        f.path as "userPhoto", 
        AVG(best_score) as "totalScore"
      FROM (
        SELECT ut.user_id, ut.tryout_id, MAX(ut.total_score) as best_score
        FROM user_tryouts ut
        INNER JOIN tryouts t ON ut.tryout_id = t.id
        WHERE ut.status = 'completed'
        ${categoryId && categoryId !== 'all' ? 'AND t.category_id = $2' : ''}
        GROUP BY ut.user_id, ut.tryout_id
      ) as user_best_scores
      INNER JOIN "users" u ON u.id = user_best_scores.user_id
      LEFT JOIN "files" f ON f.id = u.photo_id
      GROUP BY u.id, f.id
      ORDER BY "totalScore" DESC
      LIMIT $1
    `,
      categoryId && categoryId !== 'all' ? [limit, categoryId] : [limit],
    );

    const raw = await leaderboardQuery;
    return raw.map((item, index) => ({
      userId: item.userId,
      userName: `${item.firstName} ${item.lastName || ''}`.trim(),
      userPhoto: item.userPhoto,
      totalScore: Math.round(Number(item.totalScore)),
      rank: index + 1,
    }));
  }

  async getUserRank(userId: string, categoryId?: string): Promise<number> {
    const subQuery = this.repository
      .createQueryBuilder('ut')
      .innerJoin('ut.tryout', 't')
      .select('ut.user_id', 'user_id')
      .addSelect('SUM(ut.total_score)', 'total')
      .where('ut.status = :status', { status: UserTryoutStatusEnum.completed });

    if (categoryId) {
      subQuery.andWhere('t.category_id = :categoryId', { categoryId });
    }
    subQuery.groupBy('ut.user_id');

    const raw = await this.repository.manager.query(
      `
      SELECT rank FROM (
        SELECT user_id, RANK() OVER (ORDER BY AVG(best_score) DESC) as rank
        FROM (
          SELECT ut.user_id, ut.tryout_id, MAX(ut.total_score) as best_score
          FROM user_tryouts ut
          INNER JOIN tryouts t ON ut.tryout_id = t.id
          WHERE ut.status = 'completed'
          ${categoryId && categoryId !== 'all' ? 'AND t.category_id = $2' : ''}
          GROUP BY ut.user_id, ut.tryout_id
        ) as user_best_scores
        GROUP BY user_id
      ) AS ranking
      WHERE user_id = $1
    `,
      categoryId && categoryId !== 'all' ? [userId, categoryId] : [userId],
    );

    return raw.length > 0 ? Number(raw[0].rank) : 0;
  }

  async getRecentTryoutsBestScores(
    userId: string,
    limit: number,
  ): Promise<{ tryoutTitle: string; score: number }[]> {
    const raw = await this.repository.manager.query(
      `
      SELECT 
        t.title as "tryoutTitle", 
        MAX(ut.total_score) as "score",
        MAX(ut.updated_at) as "lastAttempt"
      FROM user_tryouts ut
      INNER JOIN tryouts t ON ut.tryout_id = t.id
      WHERE ut.user_id = $1 AND ut.status = 'completed'
      GROUP BY t.id, t.title
      ORDER BY "lastAttempt" DESC
      LIMIT $2
    `,
      [userId, limit],
    );

    return raw.map(item => ({
      tryoutTitle: item.tryoutTitle,
      score: Math.round(Number(item.score)),
    }));
  }
}
