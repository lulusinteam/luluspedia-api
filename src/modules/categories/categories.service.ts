import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './infrastructure/persistence/category.repository';
import { Category } from './domain/category';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAllWithPagination({
      paginationOptions: { page: 1, limit: 100 },
    });
  }
}
