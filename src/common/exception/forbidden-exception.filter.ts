import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import * as _ from 'lodash';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
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
