import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserController } from '../../utils/decorators/api-controllers.decorator';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { QueryWishlistDto } from './dto/query-wishlist.dto';
import { JSONResponse } from '../../utils/json-response';
import { Wishlist } from './domain/wishlist';
import { ApiJSendResponse } from '../../utils/swagger-jsend.decorator';

@UserController('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiJSendResponse(Wishlist)
  async create(
    @Request() request,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    const result = await this.wishlistsService.create(
      createWishlistDto,
      request.user,
    );

    if (!result) {
      return JSONResponse.success(null, {
        message: 'wishlistItemRemoved',
      });
    }

    return JSONResponse.success(result, {
      message: 'wishlistItemAdded',
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiJSendResponse(Wishlist)
  async findAll(@Request() request, @Query() query: QueryWishlistDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    const data = await this.wishlistsService.findAllWithPagination({
      paginationOptions: {
        page,
        limit,
      },
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      userId: request.user.id,
    });

    return JSONResponse.success(data, {
      pagination: {
        page,
        limit,
        count: data.length,
      },
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.wishlistsService.remove(id);
  }
}
