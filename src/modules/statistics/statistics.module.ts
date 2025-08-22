import { Module } from '@nestjs/common';
import { StatisticsController } from './http/statistics.controller';
import { TransactionsModule } from 'src/modules/transactions/transactions.module';
import { GetStatisticsUseCase } from './use-cases/get-statistics.use-case';

@Module({
  imports: [TransactionsModule],
  controllers: [StatisticsController],
  providers: [GetStatisticsUseCase],
})
export class StatisticsModule {}
