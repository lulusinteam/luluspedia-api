import { Module } from '@nestjs/common';
import { RelationalTryoutPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { DocumentTryoutPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { DatabaseConfig } from '../../database/config/database-config.type';
import databaseConfig from '../../database/config/database.config';
import { QuestionsModule } from '../questions/questions.module';
import { TryoutsService } from './tryouts.service';
import { TryoutSchedulingService } from './tasks/tryout-scheduling.service';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentTryoutPersistenceModule
  : RelationalTryoutPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, QuestionsModule],
  controllers: [],
  providers: [TryoutsService, TryoutSchedulingService],
  exports: [TryoutsService, infrastructurePersistenceModule],
})
export class TryoutsModule {}
