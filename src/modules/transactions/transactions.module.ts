import { Module } from '@nestjs/common';
import { TransactionsService } from './use-cases/transactions.service';
import { TransactionsController } from './http/transactions.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { DatabaseModule } from 'src/infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionRepository],
})
export class TransactionsModule {}
