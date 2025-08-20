import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class PinoLoggerService implements LoggerService {
  private readonly logger = pino({
    transport:
      process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty' }
        : undefined,
    level: process.env.LOG_LEVEL || 'info',
  });

  log(message: string, context?: string): void {
    this.logger.info({ context, message });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error({ context, message, trace });
  }

  warn(message: string, context?: string): void {
    this.logger.warn({ context, message });
  }

  debug(message: string, context?: string): void {
    this.logger.debug({ context, message });
  }

  verbose(message: string, context?: string): void {
    this.logger.trace({ context, message });
  }
}
