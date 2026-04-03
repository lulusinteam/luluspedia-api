import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './services/notifications.service';
import { JSONResponse } from '../../utils/json-response';
import { infinityPagination } from '../../utils/infinity-pagination';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Notifications')
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Request() request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.service.findAllWithPagination(request.user.id, {
      page,
      limit,
    });

    return JSONResponse.success({
      data: infinityPagination(data, { page, limit }),
      meta: {},
    });
  }

  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  async getUnreadCount(@Request() request) {
    const count = await this.service.getUnreadCount(request.user.id);
    return JSONResponse.success({
      data: { count },
      meta: {},
    });
  }

  @Post(':id/mark-read')
  @HttpCode(HttpStatus.OK)
  async markRead(@Request() request, @Param('id') id: string) {
    await this.service.markRead(request.user.id, id);
    return JSONResponse.success({
      data: { success: true },
      meta: {},
    });
  }
}
