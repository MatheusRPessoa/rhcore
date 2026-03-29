import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : ((exceptionResponse as Record<string, unknown>).error ??
          exception.message);

    const validationMessages =
      typeof exceptionResponse === 'object' &&
      Array.isArray((exceptionResponse as Record<string, unknown>).message)
        ? ((exceptionResponse as Record<string, unknown>).message as string[])
        : null;

    response.status(status).json({
      succeeded: false,
      data: null,
      message: validationMessages
        ? validationMessages.join('; ')
        : String(message),
      error: {
        statusCode: status,
        error: HttpStatus[status] ?? 'Error',
        ...(validationMessages ? { details: validationMessages } : {}),
      },
    });
  }
}
