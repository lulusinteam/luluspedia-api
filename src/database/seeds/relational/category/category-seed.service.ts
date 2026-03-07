import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../../modules/categories/infrastructure/persistence/relational/entities/category.entity';

@Injectable()
export class CategorySeedService {
  constructor(
    @InjectRepository(CategoryEntity)
    private repository: Repository<CategoryEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (!count) {
      await this.repository.save([
        this.repository.create({
          label: 'Manajerial',
          slug: 'manajerial',
        }),
        this.repository.create({
          label: 'Teknis',
          slug: 'teknis',
        }),
        this.repository.create({
          label: 'Sosio Kultural',
          slug: 'sosio-kultural',
        }),
      ]);
    }
  }
}
