import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { UserController } from '../../utils/decorators/api-controllers.decorator';
import {
  ApiJSendResponse,
  ApiJSendPaginatedResponse,
} from '../../utils/swagger-jsend.decorator';
import { DashboardStatsResponseDto } from './dto/dashboard-stats-response.dto';
import { DashboardContinueLearningResponseDto } from './dto/dashboard-continue-learning-response.dto';
import {
  DashboardRecommendationResponseDto,
  DashboardScoreAnalysisResponseDto,
  DashboardStudyTimeResponseDto,
  DashboardLeaderboardResponseDto,
} from './dto/dashboard-response.dto';

@ApiTags('User | Dashboard')
@UserController('dashboard')
export class DashboardUserController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiJSendResponse(DashboardStatsResponseDto)
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats(@Request() request): Promise<DashboardStatsResponseDto> {
    return this.dashboardService.getStats(request.user.id);
  }

  @ApiJSendResponse(DashboardContinueLearningResponseDto)
  @Get('continue-learning')
  @HttpCode(HttpStatus.OK)
  async getContinueLearning(
    @Request() request,
  ): Promise<DashboardContinueLearningResponseDto | null> {
    return this.dashboardService.getContinueLearning(request.user.id);
  }

  @ApiJSendPaginatedResponse(DashboardRecommendationResponseDto)
  @Get('recommendations')
  @HttpCode(HttpStatus.OK)
  async getRecommendations(
    @Request() request,
  ): Promise<DashboardRecommendationResponseDto[]> {
    return this.dashboardService.getRecommendations(request.user.id);
  }

  @ApiJSendPaginatedResponse(DashboardScoreAnalysisResponseDto)
  @Get('score-analysis')
  @HttpCode(HttpStatus.OK)
  async getScoreAnalysis(
    @Request() request,
  ): Promise<DashboardScoreAnalysisResponseDto[]> {
    return this.dashboardService.getScoreAnalysis(request.user.id);
  }

  @ApiJSendPaginatedResponse(DashboardStudyTimeResponseDto)
  @Get('study-time')
  @HttpCode(HttpStatus.OK)
  async getStudyTime(
    @Request() request,
  ): Promise<DashboardStudyTimeResponseDto[]> {
    return this.dashboardService.getStudyTime(request.user.id);
  }

  @ApiJSendResponse(DashboardLeaderboardResponseDto)
  @Get('leaderboard')
  @HttpCode(HttpStatus.OK)
  async getLeaderboard(
    @Request() request,
    @Query('categoryId') categoryId?: string,
  ): Promise<DashboardLeaderboardResponseDto> {
    return this.dashboardService.getLeaderboard(request.user.id, categoryId);
  }
}
