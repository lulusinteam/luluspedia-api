import { Module } from '@nestjs/common';
import { OptionRepository } from '../option.repository';
import { OptionRelationalRepository } from './repositories/option.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionEntity } from './entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OptionEntity])],
  providers: [
    {
      provide: OptionRepository,
      useClass: OptionRelationalRepository,
    },
  ],
  exports: [OptionRepository],
})
export class RelationalOptionPersistenceModule {}
