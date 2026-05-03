import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './infrastructure/persistence/category.repository';
import { Category } from './domain/category';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TryoutRepository } from '../tryouts/infrastructure/persistence/tryout.repository';
import { UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly tryoutRepository: TryoutRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create({
      ...createCategoryDto,
      isActive: createCategoryDto.isActive ?? true,
    });
  }

  async findAll(isActive?: boolean): Promise<Category[]> {
    return this.categoryRepository.findAllWithPagination({
      paginationOptions: { page: 1, limit: 100 },
      isActive,
    });
  }

  async findOne(id: Category['id']): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async update(
    id: Category['id'],
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async toggleActive(id: Category['id'], isActive: boolean): Promise<Category | null> {
    return this.categoryRepository.update(id, { isActive });
  }

  async remove(id: Category['id']): Promise<void> {
    const tryoutCount = await this.tryoutRepository.countByCategory(id);

    if (tryoutCount > 0) {
      throw new UnprocessableEntityException(
        'Cannot delete category because it is being used in tryouts',
      );
    }

    await this.categoryRepository.remove(id);
  }
}
