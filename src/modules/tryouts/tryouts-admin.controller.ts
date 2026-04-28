import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { ApiParam, ApiOperation } from '@nestjs/swagger';

import { NullableType } from '../../utils/types/nullable.type';
import { Tryout } from './domain/tryout';
import { TryoutsService } from './tryouts.service';
import { QuestionsService } from '../questions/questions.service';
import { Question } from '../questions/domain/question';
import { FindAllQuestionsDto } from '../questions/dto/find-all-questions.dto';
import {
  ApiJSendResponse,
  ApiJSendPaginatedResponse,
} from '../../utils/swagger-jsend.decorator';
import { CreateTryoutDto } from './dto/create-tryout.dto';
import { UpdateTryoutDto } from './dto/update-tryout.dto';
import { FindAllTryoutsDto } from './dto/find-all-tryouts.dto';
import { PaginationResponseDto } from '../../utils/dto/pagination-response.dto';
import { pagination } from '../../utils/pagination';

import { TryoutStatsResponseDto } from './dto/tryout-stats-response.dto';
import { AdminController } from '../../utils/decorators/api-controllers.decorator';

@AdminController('tryouts')
export class TryoutsAdminController {
  constructor(
    private readonly tryoutsService: TryoutsService,
    private readonly questionsService: QuestionsService,
  ) {}

  @ApiJSendResponse(Tryout)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTryoutDto: CreateTryoutDto): Promise<Tryout> {
    return this.tryoutsService.create(createTryoutDto);
  }

  @ApiJSendPaginatedResponse(Tryout)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: FindAllTryoutsDto,
  ): Promise<PaginationResponseDto<Tryout>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return pagination(
      await this.tryoutsService.findAllAdmin({
        paginationOptions: {
          page,
          limit,
        },
        search: query?.search,
        status: query?.status,
      }),
      { page, limit },
    );
  }

  @ApiJSendResponse(TryoutStatsResponseDto)
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats(): Promise<TryoutStatsResponseDto> {
    return this.tryoutsService.getStats();
  }

  @ApiJSendResponse(Tryout)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(
    @Param('id') id: Tryout['id'],
    @Request() request,
  ): Promise<NullableType<Tryout>> {
    return this.tryoutsService.findOneUser(id, request.user?.id);
  }

  @ApiJSendPaginatedResponse(Question)
  @Get(':id/questions')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async findQuestions(
    @Param('id') id: string,
    @Query() query: FindAllQuestionsDto,
  ): Promise<PaginationResponseDto<Question>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return pagination(
      await this.questionsService.findAll({
        paginationOptions: {
          page,
          limit,
        },
        tryoutId: id,
        search: query?.search,
      }),
      { page, limit },
    );
  }

  @ApiJSendResponse(Tryout)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async update(
    @Param('id') id: Tryout['id'],
    @Body() updateTryoutDto: UpdateTryoutDto,
  ): Promise<Tryout | null> {
    return this.tryoutsService.update(id, updateTryoutDto);
  }

  @Post(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOperation({
    summary: 'Unpublish a tryout',
    description:
      'Set tryout status back to draft. Only works for published tryouts.',
  })
  @ApiJSendResponse(Tryout)
  async unpublish(@Param('id') id: Tryout['id']): Promise<Tryout> {
    return this.tryoutsService.unpublish(id);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: Tryout['id']): Promise<{ id: Tryout['id'] }> {
    await this.tryoutsService.softDelete(id);

    return {
      id,
    };
  }
}
