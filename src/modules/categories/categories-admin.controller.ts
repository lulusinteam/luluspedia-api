import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { AdminController } from '../../utils/decorators/api-controllers.decorator';
import { ApiJSendResponse } from '../../utils/swagger-jsend.decorator';
import { Category } from './domain/category';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Admin | Categories')
@AdminController('categories')
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiJSendResponse(Category)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiJSendResponse(Category)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'isActive', type: Boolean, required: false })
  async findAll(@Query('isActive') isActive?: boolean): Promise<Category[]> {
    // If isActive is provided (e.g. from dropdowns), use it.
    // Otherwise, in management, show all (undefined).
    return this.categoriesService.findAll(isActive);
  }

  @ApiJSendResponse(Category)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string): Promise<Category | null> {
    return this.categoriesService.findOne(id);
  }

  @ApiJSendResponse(Category)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }

  @ApiJSendResponse(Category)
  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  activate(@Param('id') id: string): Promise<Category | null> {
    return this.categoriesService.toggleActive(id, true);
  }

  @ApiJSendResponse(Category)
  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  deactivate(@Param('id') id: string): Promise<Category | null> {
    return this.categoriesService.toggleActive(id, false);
  }
}
