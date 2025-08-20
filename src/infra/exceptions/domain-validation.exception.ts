import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class DomainValidationException extends HttpException {
  constructor(
    message: string,
    errorCode: string = 'DOMAIN_VALIDATION_ERROR',
    status: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY,
  ) {
    super(
      {
        statusCode: status,
        error: errorCode,
        message: message,
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}
