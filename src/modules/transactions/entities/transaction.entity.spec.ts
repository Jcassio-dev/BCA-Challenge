import { Transaction } from './transaction.entity';
import { TransactionValidationException } from '../exceptions/transaction-validation.exception';
import { ErrorCodes } from '../../../infra/exceptions/error-codes.enum';

describe('Transaction', () => {
  describe('constructor', () => {
    it('should create a valid transaction', () => {
      const amount = 100;
      const timestamp = new Date(Date.now() - 1000);

      const transaction = new Transaction(amount, timestamp);

      expect(transaction.amount).toBe(amount);
      expect(transaction.timestamp).toBe(timestamp);
      expect(transaction.id).toBeDefined();
    });

    it('should generate different UUID for each transaction', () => {
      const amount = 100;
      const timestamp = new Date();

      const transaction1 = new Transaction(amount, timestamp);
      const transaction2 = new Transaction(amount, timestamp);

      expect(transaction1.id).not.toBe(transaction2.id);
    });

    it('should accept custom id', () => {
      const amount = 100;
      const timestamp = new Date();
      const customId = 'custom-id-123';

      const transaction = new Transaction(amount, timestamp, customId);

      expect(transaction.id).toBe(customId);
    });
  });

  describe('validation', () => {
    it('should throw for null amount', () => {
      expect(() => {
        new Transaction(null as any, new Date());
      }).toThrow(TransactionValidationException);
    });

    it('should throw for NaN amount', () => {
      expect(() => {
        new Transaction(NaN, new Date());
      }).toThrow(TransactionValidationException);
    });

    it('should throw for negative amount', () => {
      expect(() => {
        new Transaction(-100, new Date());
      }).toThrow(TransactionValidationException);
    });

    it('should throw for null timestamp', () => {
      expect(() => {
        new Transaction(100, null as any);
      }).toThrow(TransactionValidationException);
    });

    it('should throw for invalid Date object', () => {
      expect(() => {
        new Transaction(100, new Date('invalid'));
      }).toThrow(TransactionValidationException);
    });

    it('should throw for future timestamp', () => {
      const futureDate = new Date(Date.now() + 60000);

      expect(() => {
        new Transaction(100, futureDate);
      }).toThrow(TransactionValidationException);
    });

    it('should accept zero amount', () => {
      expect(() => {
        new Transaction(0, new Date());
      }).not.toThrow();
    });

    it('should accept current timestamp', () => {
      expect(() => {
        new Transaction(100, new Date());
      }).not.toThrow();
    });
  });

  describe('create static method', () => {
    it('should create transaction using static method', () => {
      const amount = 100;
      const timestamp = new Date();

      const transaction = Transaction.create(amount, timestamp);

      expect(transaction.amount).toBe(amount);
      expect(transaction.timestamp).toBe(timestamp);
    });
  });

  describe('toJSON method', () => {
    it('should return correct JSON representation', () => {
      const amount = 100;
      const timestamp = new Date();
      const transaction = new Transaction(amount, timestamp);

      const json = transaction.toJSON();

      expect(json).toEqual({
        id: transaction.id,
        amount: amount,
        timestamp: timestamp.toISOString(),
      });
    });
  });

  describe('getters', () => {
    it('should return correct values from getters', () => {
      const amount = 100;
      const timestamp = new Date();
      const transaction = new Transaction(amount, timestamp);

      expect(transaction.amount).toBe(amount);
      expect(transaction.timestamp).toBe(timestamp);
      expect(transaction.id).toBeDefined();
    });
  });

  describe('error codes', () => {
    it('should throw with correct error codes', () => {
      try {
        new Transaction(-100, new Date());
      } catch (error) {
        expect(error).toBeInstanceOf(TransactionValidationException);
        expect(error.getResponse()).toMatchObject({
          error: ErrorCodes.AMOUNT_INVALID,
        });
      }
    });
  });
});
