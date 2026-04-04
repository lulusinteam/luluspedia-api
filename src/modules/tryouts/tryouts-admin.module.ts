import { Module } from '@nestjs/common';
import { TryoutsModule } from './tryouts.module';
import { TryoutsAdminController } from './tryouts-admin.controller';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [TryoutsModule, QuestionsModule],
  controllers: [TryoutsAdminController],
})
export class TryoutsAdminModule {}
