import { Module } from '@nestjs/common';
import { RelationalQuestionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

import { QuestionsService } from './questions.service';

@Module({
  imports: [RelationalQuestionPersistenceModule],
  controllers: [],
  providers: [QuestionsService],
  exports: [QuestionsService, RelationalQuestionPersistenceModule],
})
export class QuestionsModule {}
