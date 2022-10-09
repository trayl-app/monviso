import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '../prisma/client';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaClient = app.get(PrismaClient);
  await prismaClient.enableShutdownHooks(app);

  await app.listen(3000);
}
bootstrap();
