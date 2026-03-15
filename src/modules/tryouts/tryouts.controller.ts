import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import { NullableType } from '../../utils/types/nullable.type';
import { Tryout } from './domain/tryout';
import { TryoutsService } from './tryouts.service';
import { RolesGuard } from '../roles/roles.guard';
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

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Tryouts')
@Controller({
  path: 'tryouts',
  version: '1',
})
export class TryoutsController {
  constructor(
    private readonly tryoutsService: TryoutsService,
    private readonly questionsService: QuestionsService,
  ) {}

  @ApiJSendResponse(Tryout)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTryoutDto: CreateTryoutDto): Promise<Tryout> {
    console.log('--- CREATE TRYOUT ---');
    console.log('Request Body:', JSON.stringify(createTryoutDto, null, 2));
    const result = await this.tryoutsService.create(createTryoutDto);
    console.log('Response Data:', JSON.stringify(result, null, 2));
    return result;
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
  async getStats(): Promise<Record<string, number>> {
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
  findOne(@Param('id') id: Tryout['id']): Promise<NullableType<Tryout>> {
    return this.tryoutsService.findOne(id);
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
  ): Promise<Question[]> {
    return this.questionsService.findAll({
      paginationOptions: {
        page: query?.page ?? 1,
        limit: query?.limit ?? 10,
      },
      tryoutId: id,
    });
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
    console.log('--- UPDATE TRYOUT ---');
    console.log('ID:', id);
    console.log('Request Body:', JSON.stringify(updateTryoutDto, null, 2));
    const result = await this.tryoutsService.update(id, updateTryoutDto);
    console.log('Response Data:', JSON.stringify(result, null, 2));
    return result;
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
