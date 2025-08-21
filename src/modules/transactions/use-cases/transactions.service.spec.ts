import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Transaction } from '../entities/transaction.entity';

const mockTransactionRepository = {
  save: jest.fn(),
  clear: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: jest.Mocked<TransactionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionRepository,
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get(TransactionRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a transaction', async () => {
      const amount = 100;
      const timestamp = '2024-01-15T10:00:00.000Z';
      const expectedTransaction = Transaction.create(
        amount,
        new Date(timestamp),
      );

      repository.save.mockResolvedValue(undefined);

      const result = await service.create(amount, timestamp);

      expect(repository.save).toHaveBeenCalledWith(expect.any(Transaction));
      expect(result).toBeInstanceOf(Transaction);
      expect(result.amount).toBe(amount);
      expect(result.timestamp).toEqual(new Date(timestamp));
    });

    it('should handle repository errors on create', async () => {
      const amount = 100;
      const timestamp = '2024-01-15T10:00:00.000Z';
      const error = new Error('Database error');

      repository.save.mockRejectedValue(error);

      await expect(service.create(amount, timestamp)).rejects.toThrow(
        'Database error',
      );
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteAll', () => {
    it('should clear all transactions', async () => {
      repository.clear.mockResolvedValue(undefined);

      await service.deleteAll();

      expect(repository.clear).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors on deleteAll', async () => {
      const error = new Error('Clear error');
      repository.clear.mockRejectedValue(error);

      await expect(service.deleteAll()).rejects.toThrow('Clear error');
      expect(repository.clear).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const transactions = [
        Transaction.create(100, new Date()),
        Transaction.create(200, new Date()),
      ];

      repository.findAll.mockResolvedValue(transactions);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(transactions);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no transactions', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a transaction by id', async () => {
      const transaction = Transaction.create(100, new Date());
      repository.findById.mockResolvedValue(transaction);

      const result = await service.findById(transaction.id);

      expect(repository.findById).toHaveBeenCalledWith(transaction.id);
      expect(result).toEqual(transaction);
    });

    it('should return null if transaction not found', async () => {
      const nonExistentId = 'non-existent-id';
      repository.findById.mockResolvedValue(null);

      const result = await service.findById(nonExistentId);

      expect(repository.findById).toHaveBeenCalledWith(nonExistentId);
      expect(result).toBeNull();
    });

    it('should handle repository errors on findById', async () => {
      const transactionId = 'test-id';
      const error = new Error('Find error');
      repository.findById.mockRejectedValue(error);

      await expect(service.findById(transactionId)).rejects.toThrow(
        'Find error',
      );
      expect(repository.findById).toHaveBeenCalledWith(transactionId);
    });
  });

  describe('input validation', () => {
    it('should handle invalid timestamp string', async () => {
      const amount = 100;
      const invalidTimestamp = 'invalid-date';

      await expect(service.create(amount, invalidTimestamp)).rejects.toThrow();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
