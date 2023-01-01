import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { MeModule } from './me/me.module';
import { AuthModule } from './auth/auth.module';
import { LoggerConfig } from './common/logger/config/logger.config';
import { HealthModule } from './health/health.module';

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  LoggerModule.forRoot({
    pinoHttp: LoggerConfig.options,
  }),
  UsersModule,
  PrismaModule,
  MeModule,
  AuthModule,
  HealthModule,
];

@Module({ imports })
export class AppModule {}
