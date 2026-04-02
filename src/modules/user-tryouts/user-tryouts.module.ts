import { Module } from '@nestjs/common';
import { UserTryoutsService } from './user-tryouts.service';
import { UserTryoutsController } from './user-tryouts.controller';
import { RelationalUserTryoutPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { DocumentUserTryoutPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { DatabaseConfig } from '../../database/config/database-config.type';
import databaseConfig from '../../database/config/database.config';

import { UserTryoutSchedulingService } from './tasks/user-tryout-scheduling.service';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentUserTryoutPersistenceModule
  : RelationalUserTryoutPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [UserTryoutsController],
  providers: [UserTryoutsService, UserTryoutSchedulingService],
  exports: [UserTryoutsService, infrastructurePersistenceModule],
})
export class UserTryoutsModule {}
