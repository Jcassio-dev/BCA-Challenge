import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../entities/transaction.entity';

export class TransactionResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 100.5 })
  amount: number;

  @ApiProperty({
    example: '2025-08-20T10:00:00.000Z',
    description: 'Data e hora da transação no formato ISO 8601 (UTC)',
  })
  timestamp: string;

  static fromEntity(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      amount: transaction.amount,
      timestamp: transaction.timestamp.toISOString(),
    };
  }
}
