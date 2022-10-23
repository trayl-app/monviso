import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { MeModule } from './me/me.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './common/firebase/firebase.module';

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  LoggerModule.forRoot(
    process.env.NODE_ENV === 'development'
      ? {
          pinoHttp: {
            transport: {
              target: 'pino-pretty',
            },
          },
        }
      : undefined,
  ),
  UsersModule,
  PrismaModule,
  FirebaseModule,
  MeModule,
  AuthModule,
];

@Module({ imports })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
