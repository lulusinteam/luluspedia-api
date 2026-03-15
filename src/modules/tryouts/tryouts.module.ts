import { Module } from '@nestjs/common';
import { RelationalTryoutPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { QuestionsModule } from '../questions/questions.module';

import { TryoutsService } from './tryouts.service';

@Module({
  imports: [RelationalTryoutPersistenceModule, QuestionsModule],
  controllers: [],
  providers: [TryoutsService],
  exports: [TryoutsService, RelationalTryoutPersistenceModule],
})
export class TryoutsModule {}
