import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './infra/config/env.config';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { DomainValidationFilter } from './infra/exceptions/filters/domain-validation.filter';
import { DatabaseModule } from './infra/database/database.module';
import { LoggerModule } from './infra/logger/logger.module';
import { StatisticsModule } from './statistics/statistics.module';
import { HealthModule } from './modules/health/health.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
        limit: Number(process.env.RATE_LIMIT_MAX) || 10,
      },
    ]),
    TransactionsModule,
    DatabaseModule,
    LoggerModule,
    StatisticsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainValidationFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
