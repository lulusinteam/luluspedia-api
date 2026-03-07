import { Module } from '@nestjs/common';
import { RelationalOptionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalOptionPersistenceModule],
  providers: [],
  exports: [RelationalOptionPersistenceModule],
})
export class OptionsModule {}
