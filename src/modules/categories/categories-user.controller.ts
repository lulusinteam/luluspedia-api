import { Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { UserController } from '../../utils/decorators/api-controllers.decorator';
import { ApiJSendPaginatedResponse } from '../../utils/swagger-jsend.decorator';
import { Category } from './domain/category';

@ApiTags('User | Categories')
@UserController('categories')
export class CategoriesUserController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiJSendPaginatedResponse(Category)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }
}
