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
    let selectedOption: any = null;
    if (data.optionId) {
      const targetOptionId = data.optionId;
      const options = question.options || [];
      selectedOption = options.find(
        opt =>
          opt.id.toLowerCase().trim() === targetOptionId.toLowerCase().trim(),
      );

      if (!selectedOption) {
        throw new ApiException('optionNotInQuestion', 400, {
          error:
            'The selected option does not belong to the specified question.',
        });
      }
    }

    // Capture Snapshots
    const isCorrectSnapshot = selectedOption?.isCorrect || false;
    const weightSnapshot = selectedOption?.weight || 0;
    const pointsSnapshot = question.correctPoint || 0;

    // Deep copy question and option to avoid circular refs and strip unnecessary fields
    const questionSnapshot = {
      id: question.id,
      content: question.content,
      image: question.image,
      scoringType: question.scoringType,
      correctPoint: question.correctPoint,
      explanation: question.explanation,
      explanationImage: question.explanationImage,
      options: question.options?.map(opt => ({
        id: opt.id,
        content: opt.content,
        image: opt.image, // Sertakan image dalam snapshot
        isCorrect: opt.isCorrect,
        weight: opt.weight,
      })),
    };

    const optionSnapshot = selectedOption
      ? {
          id: selectedOption.id,
          content: selectedOption.content,
          image: selectedOption.image, // Sertakan image dalam snapshot
          isCorrect: selectedOption.isCorrect,
          weight: selectedOption.weight,
        }
      : null;

    await this.userTryoutRepository.saveAnswer({
      ...data,
      isCorrectSnapshot,
      weightSnapshot,
      pointsSnapshot,
      questionSnapshot,
      optionSnapshot,
    });
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
   * Calculate total earned points.
   */
  private calculateScore(answers: UserAnswer[]): number {
    let totalEarned = 0;

    // Calculate Total Earned Score
    for (const ans of answers) {
      // Use snapshot data if available for stability, fallback to current entity relations
      const scoringType =
        ans.questionSnapshot?.scoringType || ans.question?.scoringType;
      const isCorrect =
        ans.isCorrectSnapshot !== undefined
          ? ans.isCorrectSnapshot
          : ans.option?.isCorrect;
      const weight =
        ans.weightSnapshot !== undefined
          ? ans.weightSnapshot
          : ans.option?.weight || 0;
      const correctPoint =
        ans.pointsSnapshot !== undefined
          ? ans.pointsSnapshot
          : ans.question?.correctPoint || 0;

      if (scoringType === 'weight') {
        totalEarned += weight;
      } else {
        if (isCorrect) {
          totalEarned += correctPoint;
        }
      }
    }

    return totalEarned;
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

  async getAttemptResult(id: string, userId: string): Promise<UserTryout> {
    const attempt = await this.userTryoutRepository.findById(id);

    if (!attempt || (attempt.user && attempt.user.id !== userId)) {
      throw new NotFoundException({
        id: 'attemptNotFound',
      });
    }

    // Explicitly set answers because TypeORM leftJoinAndSelect on QueryBuilder can be flaky with nested deep joins
    attempt.answers = await this.userTryoutRepository.getAnswersByAttemptId(id);

    return attempt;
  }
}
