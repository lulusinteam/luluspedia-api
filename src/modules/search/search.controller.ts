import {
  Controller,
  Get,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SearchService } from './search.service';
import { ApiJSendResponse } from '../../utils/swagger-jsend.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Search')
@Controller({
  path: 'search',
  version: '1',
})
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiJSendResponse(Object)
  async search(@Query('q') query: string) {
    return this.searchService.globalSearch(query);
  }
}
