import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './infra/config/env.config';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainValidationFilter } from './infra/exceptions/filters/domain-validation.filter';
import { DatabaseModule } from './infra/database/database.module';
import { LoggerModule } from './infra/logger/logger.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
    }),
    TransactionsModule,
    DatabaseModule,
    LoggerModule,
    StatisticsModule,
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
