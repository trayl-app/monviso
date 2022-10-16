import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [MeController],
  imports: [UsersModule],
})
export class MeModule {}
