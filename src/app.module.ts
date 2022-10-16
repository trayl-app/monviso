import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { FirebaseAuthMiddleware } from './firebase/firebase.middleware';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersController } from './users/users.controller';
import { MeModule } from './me/me.module';
import { MeController } from './me/me.controller';

@Module({
  imports: [
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV !== 'development') {
      consumer
        .apply(FirebaseAuthMiddleware)
        .forRoutes(UsersController, MeController);
    }
  }
}
