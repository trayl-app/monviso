import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const classSerializerInterceptor = new ClassSerializerInterceptor(
    app.get(Reflector),
  );

  app.useGlobalInterceptors(classSerializerInterceptor);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Monviso')
    .setDescription(
      'The following documentation describes Monviso, the user and profile management service of the Trayl application.',
    )
    .setVersion(process.env.npm_package_version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}

bootstrap();
