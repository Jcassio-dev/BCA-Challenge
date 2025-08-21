import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async create(amount: number, timestamp: string): Promise<Transaction> {
    const date = new Date(timestamp);
    const transaction = Transaction.create(amount, date);

    await this.transactionRepository.save(transaction);
    return transaction;
  }

  async deleteAll(): Promise<void> {
    await this.transactionRepository.clear();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findById(id);
  }
}
