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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova transação' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiCreatedResponse({
    description: 'Transação criada com sucesso',
    type: TransactionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  @ApiUnprocessableEntityResponse({ description: 'Regras de negócio violadas' })
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
  @ApiOperation({ summary: 'Deletar todas as transações' })
  @ApiOkResponse({ description: 'Todas as transações foram deletadas' })
  async deleteAll(): Promise<{ message: string }> {
    await this.transactionsService.deleteAll();
    return { message: 'All transactions deleted successfully' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todas as transações' })
  @ApiOkResponse({ description: 'Lista de transações retornada com sucesso' })
  async findAll(): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionsService.findAll();
    return transactions.map(TransactionResponseDto.fromEntity);
  }
}
