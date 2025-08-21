import { Transaction } from '../entities/transaction.entity';

export class TransactionResponseDto {
  id: string;
  amount: number;
  timestamp: string;

  static fromEntity(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      amount: transaction.amount,
      timestamp: transaction.timestamp.toISOString(),
    };
  }
}
