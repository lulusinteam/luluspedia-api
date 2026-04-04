import { Injectable } from '@nestjs/common';
import { UserTryoutRepository } from '../user-tryouts/infrastructure/persistence/user-tryout.repository';
import { TryoutRepository } from '../tryouts/infrastructure/persistence/tryout.repository';
import { DashboardStatsResponseDto } from './dto/dashboard-stats-response.dto';
import { DashboardContinueLearningResponseDto } from './dto/dashboard-continue-learning-response.dto';
import {
  DashboardRecommendationResponseDto,
  DashboardScoreAnalysisResponseDto,
  DashboardStudyTimeResponseDto,
  DashboardLeaderboardResponseDto,
} from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly userTryoutRepository: UserTryoutRepository,
    private readonly tryoutRepository: TryoutRepository,
  ) {}

  async getStats(userId: string): Promise<DashboardStatsResponseDto> {
    const completedCount =
      await this.userTryoutRepository.countUserCompletedTryouts(userId);
    const [_, totalTryouts] = await this.tryoutRepository.findAllUser({
      paginationOptions: { page: 1, limit: 1 },
    });
    const bestScore = await this.userTryoutRepository.getBestScore(userId);
    const userRank = await this.userTryoutRepository.getUserRank(userId);

    const finishedPercentage =
      totalTryouts > 0 ? Math.round((completedCount / totalTryouts) * 100) : 0;

    return {
      finishedPercentage,
      completedCount,
      availableCount: totalTryouts,
      userRank,
      bestScore,
    };
  }

  async getContinueLearning(
    userId: string,
  ): Promise<DashboardContinueLearningResponseDto | null> {
    const activeAttempt =
      await this.userTryoutRepository.findInProgressAttemptByUserId(userId);

    if (!activeAttempt) return null;

    // Calculate progress (answered vs total)
    const answers = await this.userTryoutRepository.getAnswersByAttemptId(
      activeAttempt.id,
    );
    const totalQuestions = activeAttempt.tryout.questions?.length ?? 0;
    const progressPercentage =
      totalQuestions > 0 ? Math.round((answers.length / totalQuestions) * 100) : 0;

    // Calculate remaining time
    const now = new Date();
    const startTime = new Date(activeAttempt.startTime);
    const elapsedSeconds = Math.floor(
      (now.getTime() - startTime.getTime()) / 1000,
    );
    const totalDurationSeconds = (activeAttempt.tryout.duration || 0) * 60;
    const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);

    return {
      userTryoutId: activeAttempt.id,
      tryoutId: activeAttempt.tryout.id,
      title: activeAttempt.tryout.title,
      progressPercentage,
      remainingSeconds,
      cover: activeAttempt.tryout.cover?.path,
    };
  }

  async getRecommendations(
    userId: string,
  ): Promise<DashboardRecommendationResponseDto[]> {
    const [tryouts] = await this.tryoutRepository.findAllUser({
      paginationOptions: { page: 1, limit: 3 },
      isRecommended: true,
      userId,
    });

    return tryouts.map(t => ({
      id: t.id,
      title: t.title,
      cover: t.cover?.path,
      questionCount: t.questionCount || 0,
      categoryLabel: t.category.label,
    }));
  }

  async getScoreAnalysis(
    userId: string,
  ): Promise<DashboardScoreAnalysisResponseDto[]> {
    return this.userTryoutRepository.getRecentTryoutsBestScores(userId, 5);
  }

  async getStudyTime(userId: string): Promise<DashboardStudyTimeResponseDto[]> {
    const raw = await this.userTryoutRepository.getStudyTimeByCategory(userId);
    const totalSecondsAll = raw.reduce(
      (acc, curr) => acc + curr.totalSeconds,
      0,
    );

    return raw.map(item => ({
      categoryLabel: item.categoryLabel,
      durationInHours: Math.round(item.totalSeconds / 3600),
      durationPercentage:
        totalSecondsAll > 0
          ? Math.round((item.totalSeconds / totalSecondsAll) * 100)
          : 0,
    }));
  }

  async getLeaderboard(
    userId: string,
    categoryId?: string,
  ): Promise<DashboardLeaderboardResponseDto> {
    const topPlayers = await this.userTryoutRepository.getLeaderboard(
      10,
      categoryId,
    );
    const userRank = await this.userTryoutRepository.getUserRank(
      userId,
      categoryId,
    );

    return {
      topPlayers,
      currentUser: topPlayers.find(p => p.userId === userId) || {
        userId,
        userName: 'You', // This could be enriched with real donor name
        totalScore: 0, // Should be fetched if needed
        rank: userRank,
      },
    };
  }
}
