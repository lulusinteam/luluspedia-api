import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TryoutRepository } from '../infrastructure/persistence/tryout.repository';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { TryoutStatusEnum } from '../tryouts.enum';

@Injectable()
export class TryoutSchedulingService {
  private readonly logger = new Logger(TryoutSchedulingService.name);

  constructor(
    private readonly tryoutRepository: TryoutRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoPublish() {
    this.logger.debug('Running Auto Publish Task...');

    try {
      // Find what's about to be published to notify
      const toPublish = await this.tryoutRepository.findAllAdmin({
        paginationOptions: { page: 1, limit: 100 },
        status: TryoutStatusEnum.scheduled,
      });

      const now = new Date();
      // Filter those with scheduledAt <= now
      const readyToPublish = toPublish[0].filter(
        t => t.scheduledAt && new Date(t.scheduledAt) <= now,
      );

      if (readyToPublish.length > 0) {
        const affectedRows = await this.tryoutRepository.autoPublishScheduled();

        if (affectedRows > 0) {
          this.logger.log(
            `Successfully published ${affectedRows} scheduled tryouts automatically.`,
          );

          // Notify for each published tryout
          for (const tryout of readyToPublish) {
            this.notificationsService
              .notifyTryoutPublished(tryout.title || 'Untitled Tryout')
              .catch(e =>
                this.logger.error(
                  `Failed to notify auto-publish for ${tryout.id}`,
                  e,
                ),
              );
          }
        }
      }
    } catch (error) {
      this.logger.error('Failed to run Auto Publish Task', error);
    }
  }
}
