import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './modules/users/users.module';
import { FilesModule } from './modules/files/files.module';
import { AuthModule } from './modules/auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './modules/auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './modules/mail/config/mail.config';
import fileConfig from './modules/files/config/file.config';
import facebookConfig from './modules/auth-facebook/config/facebook.config';
import googleConfig from './modules/auth-google/config/google.config';
import appleConfig from './modules/auth-apple/config/apple.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAppleModule } from './modules/auth-apple/auth-apple.module';
import { AuthFacebookModule } from './modules/auth-facebook/auth-facebook.module';
import { AuthGoogleModule } from './modules/auth-google/auth-google.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './modules/mail/mail.module';
import { HomeModule } from './modules/home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { SessionModule } from './modules/session/session.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { DatabaseConfig } from './database/config/database-config.type';
import { CategoriesModule } from './modules/categories/categories.module';
import { TryoutsModule } from './modules/tryouts/tryouts.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { OptionsModule } from './modules/options/options.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { TryoutsUserController } from './modules/tryouts/tryouts-user.controller';
import { SearchModule } from './modules/search/search.module';
import { UserTryoutsModule } from './modules/user-tryouts/user-tryouts.module';

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
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
        appleConfig,
      ],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, 'i18n'), watch: true },
      }),
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
        AcceptLanguageResolver,
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    FilesModule,
    AuthModule,
    CategoriesModule,
    TryoutsModule,
    QuestionsModule,
    OptionsModule,
    RatingsModule,
    WishlistsModule,
    AuthFacebookModule,
    AuthGoogleModule,
    AuthAppleModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
    SearchModule,
    UserTryoutsModule,
  ],
  controllers: [TryoutsUserController],
})
export class AppModule {}
