import { Module } from '@nestjs/common';
import { RelationalCategoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalCategoryPersistenceModule],
  providers: [],
  exports: [RelationalCategoryPersistenceModule],
})
export class CategoriesModule {}
