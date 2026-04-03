import { Module, Global, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WebhookService } from './services/webhook.service';
import { NotificationTemplateService } from './services/notification-template.service';
import { NotificationsService } from './services/notifications.service';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { RelationalNotificationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AllConfigType } from '../../config/config.type';
import { NotificationsController } from './notifications.controller';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    RelationalNotificationPersistenceModule,
    forwardRef(() => UsersModule),
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        secret: configService.get('auth.secret', { infer: true }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    WebhookService,
    NotificationTemplateService,
    NotificationsService,
    NotificationsGateway,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
