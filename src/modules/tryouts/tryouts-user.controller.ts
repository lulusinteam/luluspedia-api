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
import { Tryout } from './domain/tryout';
import { TryoutsService } from './tryouts.service';
import { ApiJSendPaginatedResponse } from '../../utils/swagger-jsend.decorator';
import { FindUserTryoutsDto } from './dto/find-user-tryouts.dto';
import { PaginationResponseDto } from '../../utils/dto/pagination-response.dto';
import { pagination } from '../../utils/pagination';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('User | Tryouts')
@Controller({
  path: 'tryouts',
  version: '1',
})
export class TryoutsUserController {
  constructor(private readonly tryoutsService: TryoutsService) {}

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
        userId: request.user.id,
      }),
      { page, limit },
    );
  }
}
