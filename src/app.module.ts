import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './infra/config/env.config';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainValidationFilter } from './infra/exceptions/filters/domain-validation.filter';
import { DatabaseModule } from './infra/database/database.module';
import { LoggerModule } from './infra/logger/logger.module';
import { StatisticsModule } from './statistics/statistics.module';
import { HealthModule } from './modules/health/health.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: configService.get<number>('app.rateLimitWindow') ?? 60,
            limit: configService.get<number>('app.rateLimitMax')!,
          },
        ],
      }),
    }),
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
  ],
})
export class AppModule {}
