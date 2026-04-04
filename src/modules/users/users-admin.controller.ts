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
  SerializeOptions,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiParam } from '@nestjs/swagger';
import { InfinityPaginationResponseDto } from '../../utils/dto/infinity-pagination-response.dto';
import { NullableType } from '../../utils/types/nullable.type';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from './domain/user';
import { UsersService } from './users.service';
import { infinityPagination } from '../../utils/infinity-pagination';
import {
  ApiJSendResponse,
  ApiJSendPaginatedResponse,
} from '../../utils/swagger-jsend.decorator';
import { DeleteUserResponseDto } from './dto/delete-user-response.dto';
import { AdminController } from '../../utils/decorators/api-controllers.decorator';

@AdminController('users')
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @ApiJSendResponse(User)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createProfileDto);
  }

  @ApiJSendPaginatedResponse(User)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResponseDto<User>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const filterOptions = query?.filters ?? {};
    if (query?.role) {
      if (!filterOptions.roleNames) {
        filterOptions.roleNames = [];
      }
      filterOptions.roleNames.push(query.role);
    }

    return infinityPagination(
      await this.usersService.findManyWithPagination({
        filterOptions,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiJSendResponse(User)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: User['id']): Promise<NullableType<User>> {
    return this.usersService.findById(id);
  }

  @ApiJSendResponse(User)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: User['id'],
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.usersService.update(id, updateProfileDto);
  }

  @ApiJSendResponse(DeleteUserResponseDto)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: User['id']): Promise<DeleteUserResponseDto> {
    await this.usersService.remove(id);

    return {
      id,
    };
  }
}
