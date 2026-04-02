import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserTryoutRepository } from '../infrastructure/persistence/user-tryout.repository';
import { UserTryoutsService } from '../user-tryouts.service';

@Injectable()
export class UserTryoutSchedulingService {
  private readonly logger = new Logger(UserTryoutSchedulingService.name);

  constructor(
    private readonly userTryoutRepository: UserTryoutRepository,
    private readonly userTryoutsService: UserTryoutsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoFinish() {
    this.logger.debug('Running Auto Finish Task...');

    try {
      const expiredAttempts =
        await this.userTryoutRepository.findExpiredAttempts();

      if (expiredAttempts.length > 0) {
        this.logger.log(
          `Found ${expiredAttempts.length} expired attempts to auto-finish.`,
        );

        for (const attempt of expiredAttempts) {
          try {
            await this.userTryoutsService.autoFinishAttempt(attempt.id);
            this.logger.log(`Auto-finished attempt ${attempt.id}`);
          } catch (err) {
            this.logger.error(
              `Failed to auto-finish attempt ${attempt.id}`,
              err,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error('Failed to run Auto Finish Task', error);
    }
  }
}
