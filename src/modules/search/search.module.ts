import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TryoutsModule } from '../tryouts/tryouts.module';

@Module({
  imports: [TryoutsModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
