import { Module } from '@nestjs/common';
import * as fs from 'fs';
import databaseConfig from './database/config/database.config';
import authConfig from './modules/auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './modules/mail/config/mail.config';
import fileConfig from './modules/files/config/file.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './modules/mail/mail.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { SessionModule } from './modules/session/session.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { DatabaseConfig } from './database/config/database-config.type';
import { AdminAuthModule } from './modules/auth/admin/admin-auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TryoutsModule } from './modules/tryouts/tryouts.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { OptionsModule } from './modules/options/options.module';
import { QuestionsAdminController } from './modules/questions/questions-admin.controller';
import { FilesModule } from './modules/files/files.module';
import { UsersModule } from './modules/users/users.module';
import { TryoutsAdminController } from './modules/tryouts/tryouts-admin.controller';
import { UsersAdminController } from './modules/users/users-admin.controller';
import { NotificationsModule } from './modules/notifications/notifications.module';

// <database-block>
const infrastructureDatabaseModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    })
  : TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    });
// </database-block>

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const i18nPaths = [
          path.join(process.cwd(), 'src', 'i18n'),
          path.join(__dirname, 'i18n'),
          path.join(process.cwd(), 'dist', 'i18n'),
        ];
        const i18nPath = i18nPaths.find(p => fs.existsSync(p)) || i18nPaths[0];

        return {
          fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
            infer: true,
          }),
          loaderOptions: { path: i18nPath, watch: true },
        };
      },
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    AdminAuthModule,
    CategoriesModule,
    TryoutsModule,
    QuestionsModule,
    OptionsModule,
    SessionModule,
    MailModule,
    MailerModule,
    FilesModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [
    TryoutsAdminController,
    UsersAdminController,
    QuestionsAdminController,
  ],
})
export class AdminAppModule {}
