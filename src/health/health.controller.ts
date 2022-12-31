import { Controller, ControllerOptions, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from './indicators/prisma.indicator';

export const HEALTH_CONTROLLER_OPTIONS: ControllerOptions = {
  path: 'health',
};

@Controller(HEALTH_CONTROLLER_OPTIONS)
@ApiTags('Health')
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly prismaHealthIndicator: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.healthService.check([
      () => this.prismaHealthIndicator.isHealthy('database'),
    ]);
  }
}
