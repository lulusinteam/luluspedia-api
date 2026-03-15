import { Module } from '@nestjs/common';
import { RelationalQuestionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

@Module({
  imports: [RelationalQuestionPersistenceModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService, RelationalQuestionPersistenceModule],
})
export class QuestionsModule {}
