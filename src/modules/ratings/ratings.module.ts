import { Module } from '@nestjs/common';
import { RelationalRatingPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RatingsService } from './ratings.service';

@Module({
  imports: [RelationalRatingPersistenceModule],
  providers: [RatingsService],
  exports: [RatingsService, RelationalRatingPersistenceModule],
})
export class RatingsModule {}
