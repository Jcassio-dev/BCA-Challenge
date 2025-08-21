import { Type } from 'class-transformer';
import { IsNumber, IsISO8601, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(0, { message: 'Amount must be greater than or equal to 0' })
  amount: number;

  @IsISO8601(
    { strict: true },
    { message: 'Timestamp must be a valid ISO 8601 date' },
  )
  timestamp: string;
}
