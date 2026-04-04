import { Module } from '@nestjs/common';
import { TryoutsModule } from './tryouts.module';
import { TryoutsUserController } from './tryouts-user.controller';

@Module({
  imports: [TryoutsModule],
  controllers: [TryoutsUserController],
})
export class TryoutsUserModule {}
