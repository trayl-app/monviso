import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { GLOBAL_PREFIX } from './constants';
import { PrismaService } from './common/prisma/prisma.service';
import { SwaggerConfig } from './common/swagger/config/swagger.config';
import { HEALTH_CONTROLLER_OPTIONS } from './health/health.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  /**
   * Prisma interferes with NestJS enableShutdownHooks
   * @see https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
   */
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const classSerializerInterceptor = new ClassSerializerInterceptor(
    app.get(Reflector),
  );

  app.useGlobalInterceptors(classSerializerInterceptor);
  app.useGlobalPipes(new ValidationPipe());

  app.useLogger(app.get(Logger));
  app.flushLogs();

  app.setGlobalPrefix(GLOBAL_PREFIX, {
    exclude: [HEALTH_CONTROLLER_OPTIONS.path as string],
  });
  app.enableVersioning();

  SwaggerModule.setup(
    SwaggerConfig.path,
    app,
    SwaggerModule.createDocument(
      app,
      SwaggerConfig.documentConfig,
      SwaggerConfig.documentOptions,
    ),
    SwaggerConfig.customOptions,
  );

  await app.listen(8080);
}

bootstrap();
