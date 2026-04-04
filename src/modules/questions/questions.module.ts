import { Module } from '@nestjs/common';
import { RelationalQuestionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

import { QuestionsService } from './questions.service';
import { QuestionsAdminController } from './questions-admin.controller';

@Module({
  imports: [RelationalQuestionPersistenceModule],
  controllers: [QuestionsAdminController],
  providers: [QuestionsService],
  exports: [QuestionsService, RelationalQuestionPersistenceModule],
})
export class QuestionsModule {}
