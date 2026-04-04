import { UserTryout } from '../../domain/user-tryout';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';
import { NullableType } from '../../../../utils/types/nullable.type';

export abstract class UserTryoutRepository {
  abstract create(
    data: Omit<UserTryout, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<UserTryout>;

  abstract findAll({
    paginationOptions,
    userId,
    tryoutId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
    tryoutId?: string;
  }): Promise<[UserTryout[], number]>;

  abstract findById(id: UserTryout['id']): Promise<NullableType<UserTryout>>;

  abstract update(
    id: UserTryout['id'],
    payload: Partial<UserTryout>,
  ): Promise<UserTryout | null>;

  abstract findInProgressAttemptByUserId(
    userId: string,
  ): Promise<NullableType<UserTryout>>;

  abstract saveAnswer(data: {
    userTryoutId: string;
    questionId: string;
    optionId: string;
  }): Promise<void>;

  abstract getAnswersByAttemptId(userTryoutId: string): Promise<any[]>;

  abstract findExpiredAttempts(): Promise<UserTryout[]>;

  abstract remove(id: UserTryout['id']): Promise<void>;

  abstract countUserCompletedTryouts(userId: string): Promise<number>;

  abstract getBestScore(userId: string): Promise<number>;

  abstract getAverageScoreByCategory(userId: string): Promise<
    {
      categoryId: string;
      categoryLabel: string;
      averageScore: number;
    }[]
  >;

  abstract getStudyTimeByCategory(userId: string): Promise<
    {
      categoryId: string;
      categoryLabel: string;
      totalSeconds: number;
    }[]
  >;

  abstract getLeaderboard(
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
  >;

  abstract getUserRank(userId: string, categoryId?: string): Promise<number>;

  abstract getRecentTryoutsBestScores(
    userId: string,
    limit: number,
  ): Promise<{ tryoutTitle: string; score: number }[]>;
}
