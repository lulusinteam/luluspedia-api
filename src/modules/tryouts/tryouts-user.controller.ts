import {
  Get,
  HttpStatus,
  HttpCode,
  Request,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Tryout } from './domain/tryout';
import { TryoutsService } from './tryouts.service';
import {
  ApiJSendResponse,
  ApiJSendPaginatedResponse,
} from '../../utils/swagger-jsend.decorator';
import { FindUserTryoutsDto } from './dto/find-user-tryouts.dto';
import { PaginationResponseDto } from '../../utils/dto/pagination-response.dto';
import { pagination } from '../../utils/pagination';
import { NullableType } from '../../utils/types/nullable.type';
import { UserController } from '../../utils/decorators/api-controllers.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JSendResponse, JSONResponse } from '../../utils/json-response';
import { TryoutStatsResponseDto } from './dto/tryout-stats-response.dto';

@ApiTags('User | tryouts')
@UserController('tryouts')
@UseGuards(AuthGuard('jwt'))
export class TryoutsUserController {
  constructor(private readonly tryoutsService: TryoutsService) {}

  @ApiOperation({ operationId: 'user_tryouts_findAll' })
  @ApiJSendPaginatedResponse(Tryout)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Request() request,
    @Query() query: FindUserTryoutsDto,
  ): Promise<PaginationResponseDto<Tryout>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return pagination(
      await this.tryoutsService.findAllUser({
        paginationOptions: {
          page,
          limit,
        },
        search: query?.search,
        category: query?.category,
        isWishlist: query?.isWishlist,
        isRecommended: query?.isRecommended,
        userId: request.user.id,
      }),
      { page, limit },
    );
  }

  @ApiOperation({ operationId: 'user_tryouts_getStats' })
  @ApiJSendResponse(TryoutStatsResponseDto)
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats(): Promise<JSendResponse<TryoutStatsResponseDto>> {
    return JSONResponse.success(await this.tryoutsService.getStats());
  }

  @ApiOperation({ operationId: 'user_tryouts_findOne' })
  @ApiJSendResponse(Tryout)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Request() request,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<NullableType<Tryout>> {
    return this.tryoutsService.findOneUser(id, request.user.id);
  }
}
