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

@Injectable()
export class UserTryoutsService {
  constructor(private readonly userTryoutRepository: UserTryoutRepository) {}

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
    return this.userTryoutRepository.create({
      user: { id: userId } as User,
      tryout: { id: tryoutId } as Tryout,
      startTime: new Date(),
      endTime: null,
      totalScore: 0,
      status: UserTryoutStatusEnum.inProgress,
    });
  }

  async findActiveAttempt(userId: string): Promise<UserTryout | null> {
    return this.userTryoutRepository.findInProgressAttemptByUserId(userId);
  }

  async syncAnswer(
    userId: string,
    data: { userTryoutId: string; questionId: string; optionId: string },
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

    // STRICT VALIDATION: Ensure the option actually belongs to this question
    const options = question.options || [];
    const isOptionValid = options.some(
      opt => opt.id.toLowerCase().trim() === data.optionId.toLowerCase().trim(),
    );

    if (!isOptionValid) {
      throw new ApiException('optionNotInQuestion', 400, {
        error: 'The selected option does not belong to the specified question.',
      });
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

    // Get total questions for this tryout
    const totalQuestions = userTryout.tryout.questionCount || 0;
    const questionValue = totalQuestions > 0 ? 100 / totalQuestions : 0;

    let rawScore = 0;

    for (const ans of answers) {
      if (ans.option && ans.option.isCorrect) {
        // Full point for correct answer
        rawScore += questionValue;
      } else if (ans.option && ans.option.weight) {
        // Proportional scoring for weighted options
        const totalWeight =
          ans.question?.options?.reduce(
            (sum, opt) => sum + (opt.weight || 0),
            0,
          ) || 0;
        if (totalWeight > 0) {
          rawScore += (ans.option.weight / totalWeight) * questionValue;
        }
      }
    }

    const totalScore = Math.round(rawScore);

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

    // Calculate score
    const userTryout = await this.userTryoutRepository.findById(userTryoutId);
    if (!userTryout || !userTryout.tryout) {
      return; // If not found, skip scoring
    }

    const answers =
      await this.userTryoutRepository.getAnswersByAttemptId(userTryoutId);

    // Get total questions for this tryout
    const totalQuestions = userTryout.tryout.questionCount || 0;
    const questionValue = totalQuestions > 0 ? 100 / totalQuestions : 0;

    let rawScore = 0;

    for (const ans of answers) {
      if (ans.option && ans.option.isCorrect) {
        // Full point for correct answer
        rawScore += questionValue;
      } else if (ans.option && ans.option.weight) {
        // Proportional scoring for weighted options
        const totalWeight =
          ans.question?.options?.reduce(
            (sum, opt) => sum + (opt.weight || 0),
            0,
          ) || 0;
        if (totalWeight > 0) {
          rawScore += (ans.option.weight / totalWeight) * questionValue;
        }
      }
    }

    const totalScore = Math.round(rawScore);

    await this.userTryoutRepository.update(userTryoutId, {
      status: UserTryoutStatusEnum.completed,
      endTime: new Date(),
      totalScore,
    });
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
