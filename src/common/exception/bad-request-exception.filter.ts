import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      data: null,
      message:
        exceptionResponse && exceptionResponse['message']
          ? Array.isArray(exceptionResponse['message'])
            ? exceptionResponse['message'][0]
            : exceptionResponse['message']
          : `${exception.message}`,
      success: false,
    });
  }
}
