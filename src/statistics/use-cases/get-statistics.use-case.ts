import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/modules/transactions/repositories/transaction.repository';
import { StatisticsResponseDto } from '../dto/statistic-response.dto';

@Injectable()
export class GetStatisticsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(): Promise<StatisticsResponseDto> {
    const recentTransactions = await this.transactionRepository.findRecent(60);

    if (recentTransactions.length === 0) {
      return this.getEmptyStatistics();
    }

    const amounts = recentTransactions.map((t) => t.amount);
    const sum = amounts.reduce((total, amount) => total + amount, 0);
    const avg = sum / recentTransactions.length;

    return new StatisticsResponseDto({
      count: recentTransactions.length,
      sum: Number(sum.toFixed(2)),
      avg: Number(avg.toFixed(2)),
      min: Number(Math.min(...amounts).toFixed(2)),
      max: Number(Math.max(...amounts).toFixed(2)),
    });
  }

  private getEmptyStatistics(): StatisticsResponseDto {
    return new StatisticsResponseDto({
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
    });
  }
}
