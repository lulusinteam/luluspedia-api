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
import { AdminAppModule } from './admin-app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { JSendInterceptor } from './utils/jsend.interceptor';
import { JSendExceptionFilter } from './utils/jsend-exception.filter';
import { RedisIoAdapter } from './utils/redis-io.adapter';

async function bootstrapAdmin() {
  const app = await NestFactory.create(AdminAppModule, { cors: true });
  useContainer(app.select(AdminAppModule), { fallbackOnErrors: true });
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
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
    new JSendInterceptor(),
  );

  app.useGlobalFilters(new JSendExceptionFilter());

  // Socket.io Redis adapter for multi-process synchronization
  const redisIoAdapter = new RedisIoAdapter(app);
  redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  const options = new DocumentBuilder()
    .setTitle('Luluspedia Admin API')
    .setDescription('Admin API docs — restricted access')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      schema: {
        example: 'en',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const adminPort = configService.getOrThrow('app.adminPort', { infer: true });
  await app.listen(adminPort, '0.0.0.0');

  console.log(`🛡️  Admin API running on: http://localhost:${adminPort}`);
  console.log(`📋 Admin Swagger docs:    http://localhost:${adminPort}/docs`);
}
void bootstrapAdmin();
