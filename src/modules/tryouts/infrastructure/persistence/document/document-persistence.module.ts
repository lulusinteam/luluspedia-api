import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TryoutSchema, TryoutSchemaClass } from './entities/tryout.schema';
import { TryoutRepository } from '../tryout.repository';
import { TryoutDocumentRepository } from './repositories/tryout.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TryoutSchemaClass.name, schema: TryoutSchema },
    ]),
  ],
  providers: [
    {
      provide: TryoutRepository,
      useClass: TryoutDocumentRepository,
    },
  ],
  exports: [TryoutRepository],
})
export class DocumentTryoutPersistenceModule {}
