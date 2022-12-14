import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '../common/prisma/prisma.module';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './indicators/prisma.indicator';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
