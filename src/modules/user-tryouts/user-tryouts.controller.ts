import {
  Controller,
  Get,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserTryoutsService } from './user-tryouts.service';
import { FindMyAttemptsDto } from './dto/find-my-attempts.dto';
import { PaginationResponseDto } from '../../utils/dto/pagination-response.dto';
import { pagination } from '../../utils/pagination';
import { ApiJSendPaginatedResponse } from '../../utils/swagger-jsend.decorator';

import { UserTryoutResponseDto } from './dto/user-tryout-response.dto';
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
}
