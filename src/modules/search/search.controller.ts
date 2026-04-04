import {
  Controller,
  Get,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { ApiJSendResponse } from '../../utils/swagger-jsend.decorator';
import { UserController } from '../../utils/decorators/api-controllers.decorator';

@UserController('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiJSendResponse(Object)
  async search(@Request() request, @Query('q') query: string) {
    return this.searchService.globalSearch(query, request.user?.id);
  }

  @Get('popular')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiJSendResponse(Object)
  async getPopular(@Query('limit') limit?: number) {
    return this.searchService.getPopular(limit);
  }
}
