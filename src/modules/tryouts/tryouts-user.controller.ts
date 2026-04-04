import {
  Get,
  HttpStatus,
  HttpCode,
  Request,
  Param,
  Query,
  UseGuards,
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

@UserController('tryouts')
@UseGuards(AuthGuard('jwt'))
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

  @ApiJSendResponse(Tryout)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Request() request,
    @Param('id') id: Tryout['id'],
  ): Promise<NullableType<Tryout>> {
    return this.tryoutsService.findOneUser(id, request.user.id);
  }
}
