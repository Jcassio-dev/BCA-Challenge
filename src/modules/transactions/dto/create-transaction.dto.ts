import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsISO8601 } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    example: 100.5,
    description: 'Valor da transação (não negativo)',
    minimum: 0,
  })
  @IsNumber({}, { message: 'Amount must be a valid number' })
  amount: number;

  @ApiProperty({
    example: '2025-08-20T10:00:00.000Z',
    description: 'Data e hora da transação no formato ISO 8601',
  })
  @IsISO8601(
    { strict: true },
    { message: 'Timestamp must be a valid ISO 8601 date' },
  )
  timestamp: string;
}
