import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  clear(): Promise<void>;
  count(): Promise<number>;
  findRecent(seconds: number): Promise<Transaction[]>;
}
