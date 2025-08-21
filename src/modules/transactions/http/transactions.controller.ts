import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from '../use-cases/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionsService.create(
      createTransactionDto.amount,
      createTransactionDto.timestamp,
    );

    return TransactionResponseDto.fromEntity(transaction);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteAll(): Promise<{ message: string }> {
    await this.transactionsService.deleteAll();
    return { message: 'All transactions deleted successfully' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<TransactionResponseDto[]> {
    console.log('chegou aq');
    const transactions = await this.transactionsService.findAll();
    return transactions.map(TransactionResponseDto.fromEntity);
  }
}
