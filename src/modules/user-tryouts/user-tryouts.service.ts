import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { UserTryoutRepository } from './infrastructure/persistence/user-tryout.repository';
import { UserTryout } from './domain/user-tryout';
import { IPaginationOptions } from '../../utils/types/pagination-options';

import { ApiException } from '../../utils/exceptions/api.exception';
import { UserTryoutStatusEnum } from './domain/user-tryout';
import { User } from '../users/domain/user';
import { Tryout } from '../tryouts/domain/tryout';
import { TryoutsService } from '../tryouts/tryouts.service';
import { UserAnswer } from './domain/user-answer';

import { NotificationsService } from '../notifications/services/notifications.service';

@Injectable()
export class UserTryoutsService {
  constructor(
    private readonly userTryoutRepository: UserTryoutRepository,
    private readonly tryoutsService: TryoutsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async startAttempt(userId: string, tryoutId: string): Promise<UserTryout> {
    // Check if user has any in-progress attempt
    const existingAttempt =
      await this.userTryoutRepository.findInProgressAttemptByUserId(userId);

    if (existingAttempt) {
      throw new ApiException('activeAttemptExists', 400, {
        error: 'You still have an in-progress tryout. Please finish it first.',
      });
    }

    // Create new attempt
    const tryout = await this.tryoutsService.findOne(tryoutId);
    if (!tryout) {
      throw new ApiException('tryoutNotFound', 404);
    }

    let questionOrder: string[] | null = null;
    if (tryout.shuffleOptions && tryout.questions) {
      questionOrder = tryout.questions
        .map(q => q.id)
        .sort(() => Math.random() - 0.5);
    }

    return this.userTryoutRepository.create({
      user: { id: userId } as User,
      tryout: { id: tryoutId } as Tryout,
      startTime: new Date(),
      endTime: null,
      totalScore: 0,
      status: UserTryoutStatusEnum.inProgress,
      questionOrder,
    });
  }

  async findActiveAttempt(userId: string): Promise<UserTryout | null> {
    return this.userTryoutRepository.findInProgressAttemptByUserId(userId);
  }

  async syncAnswer(
    userId: string,
    data: { userTryoutId: string; questionId: string; optionId: string | null },
  ): Promise<void> {
    // Optional: Check if attempt belongs to user and is still in progress
    const attempt = await this.userTryoutRepository.findById(data.userTryoutId);
    if (!attempt || attempt.user.id !== userId) {
      throw new ApiException('attemptNotFound', 404);
    }
    if (attempt.status !== UserTryoutStatusEnum.inProgress) {
      throw new ApiException('attemptAlreadyFinished', 400);
    }

    // STRICT VALIDATION: Ensure the question actually belongs to this tryout
    const questions = attempt.tryout?.questions || [];
    const question = questions.find(
      q => q.id.toLowerCase().trim() === data.questionId.toLowerCase().trim(),
    );

    if (!question) {
      throw new ApiException('questionNotInTryout', 400, {
        error: 'This question does not belong to the specified tryout attempt.',
      });
    }

    // STRICT VALIDATION: Ensure the option actually belongs to this question (if provided)
    if (data.optionId) {
      const targetOptionId = data.optionId;
      const options = question.options || [];
      const isOptionValid = options.some(
        opt =>
          opt.id.toLowerCase().trim() === targetOptionId.toLowerCase().trim(),
      );

      if (!isOptionValid) {
        throw new ApiException('optionNotInQuestion', 400, {
          error:
            'The selected option does not belong to the specified question.',
        });
      }
    }

    await this.userTryoutRepository.saveAnswer(data);
  }

  async finishAttempt(
    userId: string,
    userTryoutId: string,
  ): Promise<UserTryout> {
    const attempt = await this.userTryoutRepository.findById(userTryoutId);
    if (!attempt || attempt.user.id !== userId) {
      throw new ApiException('attemptNotFound', 404);
    }
    if (attempt.status !== UserTryoutStatusEnum.inProgress) {
      return attempt; // Already finished
    }

    // Calculate score
    const userTryout = await this.userTryoutRepository.findById(userTryoutId);
    if (!userTryout || !userTryout.tryout) {
      throw new UnprocessableEntityException({
        id: 'attemptNotFound',
      });
    }

    const answers =
      await this.userTryoutRepository.getAnswersByAttemptId(userTryoutId);

    const totalScore = this.calculateScore(answers);

    // Notify result
    this.notificationsService
      .notifyTryoutResult(
        userTryout.user!.id,
        userTryout.tryout.title || 'Untitled Tryout',
        `${userTryout.user?.firstName || 'User'} ${userTryout.user?.lastName || ''}`,
        totalScore,
      )
      .catch(e => console.error('Notification error:', e));

    const updated = await this.userTryoutRepository.update(userTryoutId, {
      status: UserTryoutStatusEnum.completed,
      endTime: new Date(),
      totalScore,
    });

    return updated!;
  }

  async autoFinishAttempt(userTryoutId: string): Promise<void> {
    const attempt = await this.userTryoutRepository.findById(userTryoutId);
    if (!attempt || attempt.status !== UserTryoutStatusEnum.inProgress) {
      return;
    }

    const userTryout = await this.userTryoutRepository.findById(userTryoutId);
    if (!userTryout || !userTryout.tryout) {
      return;
    }

    const answers =
      await this.userTryoutRepository.getAnswersByAttemptId(userTryoutId);

    const totalScore = this.calculateScore(answers);

    // Notify result
    this.notificationsService
      .notifyTryoutResult(
        userTryout.user!.id,
        userTryout.tryout.title || 'Untitled Tryout',
        `${userTryout.user?.firstName || 'User'} ${userTryout.user?.lastName || ''}`,
        totalScore,
      )
      .catch(e => console.error('Notification error:', e));

    await this.userTryoutRepository.update(userTryoutId, {
      status: UserTryoutStatusEnum.completed,
      endTime: new Date(),
      totalScore,
    });
  }

  /**
   * Calculate absolute score based on points or weights.
   * Point type: uses question.correctPoint if answer is correct.
   * Weight type: uses option.weight directly.
   */
  private calculateScore(answers: UserAnswer[]): number {
    let finalScore = 0;

    for (const ans of answers) {
      if (!ans.question || !ans.option) continue;

      if (ans.question.scoringType === 'weight') {
        finalScore += ans.option.weight || 0;
      } else {
        // Point type (e.g. TIU/TWK)
        if (ans.option.isCorrect) {
          finalScore += ans.question.correctPoint || 0;
        }
      }
    }

    return Math.round(finalScore);
  }

  async findAllMyAttempts({
    paginationOptions,
    userId,
    tryoutId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
    tryoutId?: string;
  }): Promise<[UserTryout[], number]> {
    return this.userTryoutRepository.findAll({
      paginationOptions,
      userId,
      tryoutId,
    });
  }

  async getAttemptResult(id: string): Promise<UserTryout> {
    const attempt = await this.userTryoutRepository.findById(id);

    if (!attempt) {
      throw new NotFoundException({
        id: 'attemptNotFound',
      });
    }

    // Explicitly set answers because TypeORM leftJoinAndSelect on QueryBuilder can be flaky with nested deep joins
    attempt.answers = await this.userTryoutRepository.getAnswersByAttemptId(id);

    return attempt;
  }
}
