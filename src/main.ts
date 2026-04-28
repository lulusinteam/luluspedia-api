import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { TryoutsUserModule } from './modules/tryouts/tryouts-user.module';
import { TryoutsAdminModule } from './modules/tryouts/tryouts-admin.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { OptionsModule } from './modules/options/options.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { AuthFacebookModule } from './modules/auth-facebook/auth-facebook.module';
import { AuthGoogleModule } from './modules/auth-google/auth-google.module';
import { AuthAppleModule } from './modules/auth-apple/auth-apple.module';
import { UserTryoutsModule } from './modules/user-tryouts/user-tryouts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HomeModule } from './modules/home/home.module';
import { SearchModule } from './modules/search/search.module';
import { AdminAuthModule } from './modules/auth/admin/admin-auth.module';
import { MailModule } from './modules/mail/mail.module';
import { SessionModule } from './modules/session/session.module';
import { RolesModule } from './modules/roles/roles.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { JSendInterceptor } from './utils/jsend.interceptor';
import { JSendExceptionFilter } from './utils/jsend-exception.filter';
import { RedisIoAdapter } from './utils/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
    // JSendInterceptor standardizes API responses according to JSend specification
    new JSendInterceptor(),
  );

  // Apply global exception filter for JSend formatted error responses
  app.useGlobalFilters(new JSendExceptionFilter());

  // Socket.io Redis adapter for multi-process synchronization
  const redisIoAdapter = new RedisIoAdapter(app);
  redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // --- Helper: Elite Swagger Filter ---
  const filterByTag = (doc: any, prefix: string) => {
    const filteredDoc = JSON.parse(JSON.stringify(doc)); // Clone
    const paths = {};
    Object.keys(filteredDoc.paths).forEach(path => {
      const methods = filteredDoc.paths[path];
      const filteredMethods = {};
      Object.keys(methods).forEach(method => {
        if (methods[method].tags?.some(tag => tag.startsWith(prefix))) {
          filteredMethods[method] = methods[method];
        }
      });
      if (Object.keys(filteredMethods).length > 0) {
        paths[path] = filteredMethods;
      }
    });
    filteredDoc.paths = paths;
    return filteredDoc;
  };

  // --- Swagger Setup for USER ---
  const optionsUser = new DocumentBuilder()
    .setTitle('Luluspedia | User API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  let documentUser = SwaggerModule.createDocument(app, optionsUser, {
    include: [
      HomeModule,
      AuthModule,
      AuthFacebookModule,
      AuthGoogleModule,
      AuthAppleModule,
      UsersModule,
      FilesModule,
      CategoriesModule,
      TryoutsUserModule,
      QuestionsModule,
      OptionsModule,
      RatingsModule,
      WishlistsModule,
      UserTryoutsModule,
      NotificationsModule,
      SearchModule,
      MailModule,
      SessionModule,
      DashboardModule,
    ],
  });
  documentUser = filterByTag(documentUser, 'User');
  SwaggerModule.setup('docs/user', app, documentUser);

  // --- Swagger Setup for ADMIN ---
  const optionsAdmin = new DocumentBuilder()
    .setTitle('Luluspedia | Admin API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  let documentAdmin = SwaggerModule.createDocument(app, optionsAdmin, {
    include: [
      RolesModule,
      AdminAuthModule,
      TryoutsAdminModule,
      UsersModule,
      QuestionsModule,
      NotificationsModule,
      FilesModule,
      CategoriesModule,
    ],
  });
  documentAdmin = filterByTag(documentAdmin, 'Admin');
  SwaggerModule.setup('docs/admin', app, documentAdmin);

  // --- Smart Redirect for /docs ---
  app.use('/docs', (req: any, res: any, next: any) => {
    // Hindari infinite loop jika sudah di path docs/admin atau docs/user
    if (req.path !== '/' && req.path !== '') return next();

    const host = req.headers.host;
    const adminDomain = configService
      .get('app.backendDomainAdmin', { infer: true })
      ?.replace(/^https?:\/\//, '')
      .replace(/\/$/, '');

    // Logika detour berdasarkan domain atau port local 7000
    if (host === adminDomain || host?.includes('7000')) {
      return res.redirect('/docs/admin');
    }
    return res.redirect('/docs/user');
  });

  const port = configService.getOrThrow('app.port', { infer: true });
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application running on port: ${port}`);
  console.log(`📖 Swagger (User): http://localhost:${port}/docs`);
  console.log(`📖 Swagger (Admin): http://localhost:${port}/docs/admin`);

  console.log(`🚀 Application running on port: ${port}`);
  console.log(`👤 User Docs:   http://localhost:${port}/docs`);
  console.log(`🛡️  Admin Docs:  http://localhost:${port}/docs/admin`);
}
void bootstrap();
