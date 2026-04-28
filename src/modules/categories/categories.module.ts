import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesUserController } from './categories-user.controller';
import { CategoriesAdminController } from './categories-admin.controller';
import { RelationalCategoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { TryoutsModule } from '../tryouts/tryouts.module';

@Module({
  imports: [RelationalCategoryPersistenceModule, TryoutsModule],
  providers: [CategoriesService],
  controllers: [CategoriesUserController, CategoriesAdminController],
  exports: [CategoriesService, RelationalCategoryPersistenceModule],
})
export class CategoriesModule {}
