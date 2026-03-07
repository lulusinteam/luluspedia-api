import { Module } from '@nestjs/common';
import { RelationalTryoutPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalTryoutPersistenceModule],
  providers: [],
  exports: [RelationalTryoutPersistenceModule],
})
export class TryoutsModule {}
