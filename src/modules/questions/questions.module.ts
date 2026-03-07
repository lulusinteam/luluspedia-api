import { Module } from '@nestjs/common';
import { RelationalQuestionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalQuestionPersistenceModule],
  providers: [],
  exports: [RelationalQuestionPersistenceModule],
})
export class QuestionsModule {}
