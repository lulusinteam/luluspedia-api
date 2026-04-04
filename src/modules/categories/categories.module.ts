import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesUserController } from './categories-user.controller';
import { RelationalCategoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalCategoryPersistenceModule],
  providers: [CategoriesService],
  controllers: [CategoriesUserController],
  exports: [CategoriesService, RelationalCategoryPersistenceModule],
})
export class CategoriesModule {}
