import { Module } from '@nestjs/common';
import { DashboardUserController } from './dashboard-user.controller';
import { DashboardService } from './dashboard.service';
import { UserTryoutsModule } from '../user-tryouts/user-tryouts.module';
import { TryoutsModule } from '../tryouts/tryouts.module';

@Module({
  imports: [UserTryoutsModule, TryoutsModule],
  controllers: [DashboardUserController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
