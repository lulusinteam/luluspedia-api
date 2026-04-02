import {
  Controller,
  Get,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  Request,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserTryoutsService } from './user-tryouts.service';
import { FindMyAttemptsDto } from './dto/find-my-attempts.dto';
import { StartAttemptDto } from './dto/start-attempt.dto';
import { SyncAnswerDto } from './dto/sync-answer.dto';
import { FinishAttemptDto } from './dto/finish-attempt.dto';
import { PaginationResponseDto } from '../../utils/dto/pagination-response.dto';
import { pagination } from '../../utils/pagination';
import {
  ApiJSendResponse,
  ApiJSendPaginatedResponse,
} from '../../utils/swagger-jsend.decorator';

import { UserTryoutResponseDto } from './dto/user-tryout-response.dto';
import { UserTryoutResultResponseDto } from './dto/user-tryout-result-response.dto';
import { UserTryoutMapper } from './infrastructure/persistence/relational/mappers/user-tryout.mapper';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('User | Tryout Attempts')
@Controller({
  path: 'user-tryouts',
  version: '1',
})
export class UserTryoutsController {
  constructor(private readonly userTryoutsService: UserTryoutsService) {}

  @ApiJSendResponse(UserTryoutResponseDto)
  @Post('start-attempt')
  @HttpCode(HttpStatus.CREATED)
  async startAttempt(
    @Request() request,
    @Body() startAttemptDto: StartAttemptDto,
  ): Promise<UserTryoutResponseDto> {
    const result = await this.userTryoutsService.startAttempt(
      request.user.id,
      startAttemptDto.tryoutId,
    );

    return UserTryoutMapper.toResponseDto(result);
  }

  @ApiJSendResponse(UserTryoutResponseDto)
  @Get('active-attempt')
  @HttpCode(HttpStatus.OK)
  async findActiveAttempt(
    @Request() request,
  ): Promise<UserTryoutResponseDto | null> {
    const result = await this.userTryoutsService.findActiveAttempt(
      request.user.id,
    );

    return result ? UserTryoutMapper.toResponseDto(result) : null;
  }

  @Post('sync-answer')
  @HttpCode(HttpStatus.OK)
  async syncAnswer(
    @Request() request,
    @Body() syncAnswerDto: SyncAnswerDto,
  ): Promise<void> {
    return this.userTryoutsService.syncAnswer(request.user.id, syncAnswerDto);
  }

  @ApiJSendResponse(UserTryoutResponseDto)
  @Post('finish-attempt')
  @HttpCode(HttpStatus.OK)
  async finishAttempt(
    @Request() request,
    @Body() finishAttemptDto: FinishAttemptDto,
  ): Promise<UserTryoutResponseDto> {
    const result = await this.userTryoutsService.finishAttempt(
      request.user.id,
      finishAttemptDto.userTryoutId,
    );
    return UserTryoutMapper.toResponseDto(result);
  }

  @ApiJSendPaginatedResponse(UserTryoutResponseDto)
  @Get('my-attempts')
  @HttpCode(HttpStatus.OK)
  async findAllMyAttempts(
    @Request() request,
    @Query() query: FindMyAttemptsDto,
  ): Promise<PaginationResponseDto<UserTryoutResponseDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const [items, total] = await this.userTryoutsService.findAllMyAttempts({
      paginationOptions: {
        page,
        limit,
      },
      userId: request.user.id,
      tryoutId: query?.tryoutId,
    });

    return pagination(
      [items.map(item => UserTryoutMapper.toResponseDto(item)), total],
      { page, limit },
    );
  }

  @ApiJSendResponse(UserTryoutResultResponseDto)
  @Get('attempts/:id')
  @HttpCode(HttpStatus.OK)
  async findAttemptResult(
    @Param('id') id: string,
  ): Promise<UserTryoutResultResponseDto> {
    const result = await this.userTryoutsService.getAttemptResult(id);
    return UserTryoutMapper.toResultResponseDto(result);
  }
}
