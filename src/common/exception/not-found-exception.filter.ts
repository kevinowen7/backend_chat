import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as _ from 'lodash';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let exceptionData = null;
    if (exceptionResponse) {
      if (!_.isEmpty(exceptionResponse)) {
        if (exceptionResponse.hasOwnProperty('message')) delete exceptionResponse['message'];
        if (exceptionResponse.hasOwnProperty('statusCode')) delete exceptionResponse['statusCode'];
        if (exceptionResponse.hasOwnProperty('error')) delete exceptionResponse['error'];

        exceptionData = exceptionResponse;
      }
    }

    response.status(status).json({
      data: !_.isEmpty(exceptionData) ? exceptionData : null,
      message: `${exception.message}`,
      success: false,
    });
  }
}
