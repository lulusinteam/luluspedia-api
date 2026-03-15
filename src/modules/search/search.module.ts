import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TryoutsModule } from '../tryouts/tryouts.module';
import { SearchHistoryEntity } from './infrastructure/persistence/relational/entities/search-history.entity';

@Module({
  imports: [TryoutsModule, TypeOrmModule.forFeature([SearchHistoryEntity])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
