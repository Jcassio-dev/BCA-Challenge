import { Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { ITransactionRepository } from '../interfaces/transaction-repository.interface';
import { DatabaseService } from 'src/infra/database/database.service';
import { TransactionNotFoundException } from '../exceptions/transaction-not-found.exception';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  private readonly storeKey = 'transactions';

  constructor(private readonly databaseService: DatabaseService) {}

  async save(transaction: Transaction): Promise<void> {
    await this.databaseService.set(
      `transaction:${transaction.id}`,
      transaction,
    );

    const allIds = await this.getAllIds();

    if (!allIds.includes(transaction.id)) {
      allIds.push(transaction.id);
      await this.databaseService.set(this.storeKey, allIds);
    }
  }

  async findAll(): Promise<Transaction[]> {
    const allIds = await this.getAllIds();
    const transactions: Transaction[] = [];

    for (const id of allIds) {
      const transaction = await this.databaseService.get<Transaction>(
        `transaction:${id}`,
      );
      if (transaction) {
        transactions.push(transaction);
      }
    }

    return transactions;
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.databaseService.get<Transaction>(
      `transaction:${id}`,
    );

    if (!transaction) {
      throw new TransactionNotFoundException(id);
    }

    return transaction;
  }

  async clear(): Promise<void> {
    const allIds = await this.getAllIds();

    for (const id of allIds) {
      await this.databaseService.delete(`transaction:${id}`);
    }

    await this.databaseService.delete(this.storeKey);
  }

  async count(): Promise<number> {
    const allIds = await this.getAllIds();
    return allIds.length;
  }

  async findRecent(seconds: number): Promise<Transaction[]> {
    const now = new Date();
    const allTransactions = await this.findAll();

    return allTransactions.filter((transaction) => {
      const diffInSeconds =
        (now.getTime() - transaction.timestamp.getTime()) / 1000;
      return diffInSeconds <= seconds;
    });
  }

  private async getAllIds(): Promise<string[]> {
    return (await this.databaseService.get<string[]>(this.storeKey)) || [];
  }
}
