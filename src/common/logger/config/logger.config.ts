import { Options } from 'pino-http';

export class LoggerConfig {
  static get options(): Options {
    return {
      name: 'monviso',
      level: process.env.LOG_LEVEL || 'debug',
      enabled: process.env.NODE_ENV !== 'test',
      transport: process.env.NODE_ENV !== 'test' ? this.transport : undefined,
    };
  }

  static get transport(): Options['transport'] {
    return {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: true,
        ignore: 'pid,hostname',
        singleLine: true,
      },
    };
  }
}
