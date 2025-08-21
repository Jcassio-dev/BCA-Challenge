import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from './transaction.repository';
import { DatabaseService } from 'src/infra/database/database.service';
import { Transaction } from '../entities/transaction.entity';
import { TransactionNotFoundException } from '../exceptions/transaction-not-found.exception';

const createMockDatabaseService = () => ({
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(true),
  clear: jest.fn().mockResolvedValue(undefined),
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
});

describe('TransactionRepository', () => {
  let repository: TransactionRepository;
  let mockDatabaseService: ReturnType<typeof createMockDatabaseService>;

  const createTestTransaction = (amount: number, date: Date) => {
    const transaction = Transaction.create(amount, date);
    return transaction;
  };

  beforeEach(async () => {
    mockDatabaseService = createMockDatabaseService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService as unknown as DatabaseService,
        },
      ],
    }).compile();

    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  it('should save a transaction', async () => {
    const transaction: Transaction = Transaction.create(100, new Date());
    mockDatabaseService.get.mockResolvedValueOnce([]);

    await repository.save(transaction);

    expect(mockDatabaseService.set).toHaveBeenCalledWith(
      `transaction:${transaction.id}`,
      {
        id: transaction.id,
        amount: transaction.amount,
        timestamp: transaction.timestamp.toISOString(),
      },
    );
  });
  it('should find all transactions', async () => {
    const transaction1 = createTestTransaction(100, new Date());
    const transaction2 = createTestTransaction(200, new Date());

    mockDatabaseService.get.mockResolvedValueOnce([
      transaction1.id,
      transaction2.id,
    ]);
    mockDatabaseService.get
      .mockResolvedValueOnce(transaction1)
      .mockResolvedValueOnce(transaction2);

    const result = await repository.findAll();

    expect(result).toEqual([transaction1, transaction2]);
    expect(mockDatabaseService.get).toHaveBeenCalledWith('transactions');
  });

  it('should find a transaction by id', async () => {
    const transaction = createTestTransaction(100, new Date());
    mockDatabaseService.get.mockResolvedValueOnce(transaction);

    const result = await repository.findById(transaction.id);

    expect(result).toEqual(transaction);
    expect(mockDatabaseService.get).toHaveBeenCalledWith(
      `transaction:${transaction.id}`,
    );
  });

  it('should throw an exception if transaction not found by id', async () => {
    const nonExistentId = 'non-existent-uuid-12345';
    mockDatabaseService.get.mockResolvedValueOnce(undefined);

    await expect(repository.findById(nonExistentId)).rejects.toThrow(
      TransactionNotFoundException,
    );
    expect(mockDatabaseService.get).toHaveBeenCalledWith(
      `transaction:${nonExistentId}`,
    );
  });

  it('should clear all transactions', async () => {
    const transaction1 = createTestTransaction(100, new Date());
    const transaction2 = createTestTransaction(200, new Date());

    mockDatabaseService.get.mockResolvedValueOnce([
      transaction1.id,
      transaction2.id,
    ]);

    await repository.clear();

    expect(mockDatabaseService.delete).toHaveBeenCalledWith(
      `transaction:${transaction1.id}`,
    );
    expect(mockDatabaseService.delete).toHaveBeenCalledWith(
      `transaction:${transaction2.id}`,
    );
    expect(mockDatabaseService.delete).toHaveBeenCalledWith('transactions');
  });

  it('should find recent transactions', async () => {
    const now = new Date();
    const recentTransaction = createTestTransaction(
      100,
      new Date(now.getTime() - 5000),
    );
    const oldTransaction = createTestTransaction(
      200,
      new Date(now.getTime() - 61000),
    );

    mockDatabaseService.get.mockResolvedValueOnce([
      recentTransaction.id,
      oldTransaction.id,
    ]);
    mockDatabaseService.get
      .mockResolvedValueOnce({
        id: recentTransaction.id,
        amount: recentTransaction.amount,
        timestamp: recentTransaction.timestamp.toISOString(),
      })
      .mockResolvedValueOnce({
        id: oldTransaction.id,
        amount: oldTransaction.amount,
        timestamp: oldTransaction.timestamp.toISOString(),
      });

    const result = await repository.findRecent(60);

    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(100);
  });
});
