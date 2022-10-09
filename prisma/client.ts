import { INestApplication, OnModuleInit } from '@nestjs/common';
import { PrismaClient as PC } from '@prisma/client';

export class PrismaClient extends PC implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
