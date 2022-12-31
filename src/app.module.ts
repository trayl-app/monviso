import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { MeModule } from './me/me.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './common/firebase/firebase.module';
import { LoggerConfig } from './common/logger/config/logger.config';
import { HealthModule } from './health/health.module';
import { HEALTH_CONTROLLER_OPTIONS } from './health/health.controller';

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  LoggerModule.forRoot({
    pinoHttp: LoggerConfig.options,
  }),
  UsersModule,
  PrismaModule,
  FirebaseModule,
  MeModule,
  AuthModule,
  HealthModule,
];

@Module({ imports })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // @todo replace auth middleware with guard (then we can remove this shit)
    consumer
      .apply(AuthMiddleware)
      .exclude(HEALTH_CONTROLLER_OPTIONS.path as string)
      .forRoutes('*');
  }
}
