import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
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

  await app.listen(8080);
}

bootstrap();
