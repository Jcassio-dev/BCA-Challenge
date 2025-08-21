import { TransactionValidationException } from '../exceptions/transaction-validation.exception';
import { ErrorCodes } from 'src/infra/exceptions/error-codes.enum';
import { generateUUID } from 'src/common/utils/uuid.utils';

export class Transaction {
  private readonly _amount: number;
  private readonly _timestamp: Date;
  private readonly _id: string;

  constructor(amount: number, timestamp: Date, id?: string) {
    this.validateAmount(amount);
    this.validateTimestamp(timestamp);

    this._amount = amount;
    this._timestamp = timestamp;
    this._id = id ?? generateUUID();
  }

  get amount(): number {
    return this._amount;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  get id(): string {
    return this._id;
  }

  private validateAmount(amount: number) {
    if (amount === null)
      throw new TransactionValidationException(
        'É necessário informar um montante válido para a transação',
        ErrorCodes.AMOUNT_REQUIRED,
      );

    if (typeof amount !== 'number' || Number.isNaN(amount))
      throw new TransactionValidationException(
        'É necessário informar um montante válido para a transação',
        ErrorCodes.AMOUNT_INVALID,
      );

    if (amount < 0)
      throw new TransactionValidationException(
        'O valor do montante deve ser maior ou igual a zero',
        ErrorCodes.AMOUNT_INVALID,
      );
  }

  private validateTimestamp(timestamp: Date) {
    if (timestamp === null)
      throw new TransactionValidationException(
        'É necessário informar um timestamp válido para a transação',
        ErrorCodes.TIMESTAMP_REQUIRED,
      );

    if (!(timestamp instanceof Date)) {
      throw new TransactionValidationException(
        'Timestamp deve ser uma instância de Date',
        ErrorCodes.TIMESTAMP_INVALID_TYPE,
      );
    }

    if (Number.isNaN(timestamp.getTime())) {
      throw new TransactionValidationException(
        'Timestamp deve ser uma data válida',
        ErrorCodes.TIMESTAMP_INVALID,
      );
    }

    const now = new Date();
    if (timestamp > now) {
      throw new TransactionValidationException(
        'Timestamp não pode ser uma data futura',
        ErrorCodes.TIMESTAMP_FUTURE,
      );
    }
  }

  static create(amount: number, timestamp: Date): Transaction {
    return new Transaction(amount, timestamp);
  }

  toJSON() {
    return {
      id: this._id,
      amount: this._amount,
      timestamp: this._timestamp.toISOString(),
    };
  }
}
