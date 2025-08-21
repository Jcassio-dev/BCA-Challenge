import { IsNumber, IsISO8601 } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber({}, { message: 'Amount must be a valid number' })
  amount: number;

  @IsISO8601(
    { strict: true },
    { message: 'Timestamp must be a valid ISO 8601 date' },
  )
  timestamp: string;
}
