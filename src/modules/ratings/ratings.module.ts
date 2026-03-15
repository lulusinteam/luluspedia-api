import { Module } from '@nestjs/common';
import { RelationalRatingPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalRatingPersistenceModule],
  providers: [],
  exports: [RelationalRatingPersistenceModule],
})
export class RatingsModule {}
