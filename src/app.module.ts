import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './infra/config/env.config';
import { PinoLoggerService } from './infra/logger/logger.service';
import { DatabaseService } from './infra/database/database.service';
import { APP_FILTER } from '@nestjs/core';
import { DomainValidationFilter } from './infra/exceptions/filters/domain-validation.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
    }),
  ],
  controllers: [],
  providers: [
    PinoLoggerService,
    DatabaseService,
    {
      provide: APP_FILTER,
      useClass: DomainValidationFilter,
    },
  ],
  exports: [PinoLoggerService, DatabaseService],
})
export class AppModule {}
