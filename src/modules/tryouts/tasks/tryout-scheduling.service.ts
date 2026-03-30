import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TryoutRepository } from '../infrastructure/persistence/tryout.repository';

@Injectable()
export class TryoutSchedulingService {
  private readonly logger = new Logger(TryoutSchedulingService.name);

  constructor(private readonly tryoutRepository: TryoutRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoPublish() {
    this.logger.debug('Running Auto Publish Task...');

    try {
      const affectedRows = await this.tryoutRepository.autoPublishScheduled();

      if (affectedRows > 0) {
        this.logger.log(
          `Successfully published ${affectedRows} scheduled tryouts automatically.`,
        );
      }
    } catch (error) {
      this.logger.error('Failed to run Auto Publish Task', error);
    }
  }
}
