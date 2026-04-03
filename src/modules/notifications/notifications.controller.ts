import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './services/notifications.service';
import { JSONResponse } from '../../utils/json-response';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Notifications')
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

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
