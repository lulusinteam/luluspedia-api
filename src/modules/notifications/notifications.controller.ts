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
import { pagination } from '../../utils/pagination';
import { PaginationResponseDto } from '../../utils/dto/pagination-response.dto';
import { Notification } from './domain/notification';

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
  ): Promise<PaginationResponseDto<Notification>> {
    const finalLimit = limit > 50 ? 50 : limit;

    return pagination(
      await this.service.findAllWithPagination(request.user.id, {
        page,
        limit: finalLimit,
      }),
      { page, limit: finalLimit },
    );
  }

  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  async getUnreadCount(@Request() request) {
    const count = await this.service.getUnreadCount(request.user.id);
    return { count };
  }

  @Post(':id/mark-read')
  @HttpCode(HttpStatus.OK)
  async markRead(@Request() request, @Param('id') id: string) {
    await this.service.markRead(request.user.id, id);
    return { success: true };
  }
}

