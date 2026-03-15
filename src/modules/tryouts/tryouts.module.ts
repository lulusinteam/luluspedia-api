import { Module } from '@nestjs/common';
import { RelationalTryoutPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { QuestionsModule } from '../questions/questions.module';

import { TryoutsService } from './tryouts.service';
import { TryoutsController } from './tryouts.controller';

@Module({
  imports: [RelationalTryoutPersistenceModule, QuestionsModule],
  controllers: [TryoutsController],
  providers: [TryoutsService],
  exports: [TryoutsService, RelationalTryoutPersistenceModule],
})
export class TryoutsModule {}
