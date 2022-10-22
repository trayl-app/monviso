import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { GLOBAL_PREFIX } from './constants';
import { PrismaService } from './common/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const classSerializerInterceptor = new ClassSerializerInterceptor(
    app.get(Reflector),
  );

  app.useGlobalInterceptors(classSerializerInterceptor);
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(GLOBAL_PREFIX);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Monviso')
    .setDescription(
      'The following documentation describes Monviso, the user and profile management service of the Trayl application.',
    )
    .setVersion(process.env.npm_package_version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(GLOBAL_PREFIX, app, document);

  await app.listen(8080);
}

bootstrap();
