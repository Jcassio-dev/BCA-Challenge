import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { DomainValidationException } from '../domain-validation.exception';
import { Response } from 'express';

@Catch(DomainValidationException)
export class DomainValidationFilter implements ExceptionFilter {
  catch(exception: DomainValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const responseBody = exception.getResponse();

    response.status(status).json(responseBody);
  }
}
