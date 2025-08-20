import { HttpStatus } from '@nestjs/common';
import { DomainValidationException } from 'src/infra/exceptions/domain-validation.exception';
import { ErrorCodes } from 'src/infra/exceptions/error-codes.enum';

export class TransactionValidationException extends DomainValidationException {
  constructor(
    message: string,
    errorCode: string = ErrorCodes.TRANSACTION_VALIDATION_ERROR,
  ) {
    super(message, errorCode, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
