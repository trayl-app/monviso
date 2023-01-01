import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [MeController],
  imports: [UsersModule, AuthModule],
})
export class MeModule {}
