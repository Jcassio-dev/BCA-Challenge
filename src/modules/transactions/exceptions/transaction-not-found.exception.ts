import { HttpStatus } from '@nestjs/common';
import { DomainValidationException } from 'src/infra/exceptions/domain-validation.exception';
import { ErrorCodes } from 'src/infra/exceptions/error-codes.enum';

export class TransactionNotFoundException extends DomainValidationException {
  constructor(transactionId: string) {
    super(
      `Transação de Id ${transactionId} não encontrada.`,
      ErrorCodes.TRANSACTION_NOT_FOUND,
      HttpStatus.NOT_FOUND,
    );
  }
}
