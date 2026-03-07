import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OptionSchema, OptionSchemaClass } from './entities/option.schema';
import { OptionRepository } from '../option.repository';
import { OptionDocumentRepository } from './repositories/option.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OptionSchemaClass.name, schema: OptionSchema },
    ]),
  ],
  providers: [
    {
      provide: OptionRepository,
      useClass: OptionDocumentRepository,
    },
  ],
  exports: [OptionRepository],
})
export class DocumentOptionPersistenceModule {}
