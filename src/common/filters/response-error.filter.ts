import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { isArray, isString } from 'class-validator';
import { Response } from 'express';
import { ResponseStruct } from '../types/response-struct';

export class ResponseErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    // 统一处理客户端异常
    if (('' + code).startsWith('4')) {
      response.status(200);
      response.setHeader('content-type', 'application/json; charset=utf-8');
      const responseStruct = new ResponseStruct(null, code);
      if (!responseStruct.msg) {
        if (isString(exceptionResponse)) {
          responseStruct.msg = exceptionResponse;
        } else if (
          Object.prototype.hasOwnProperty.call(exceptionResponse, 'message')
        ) {
          if (isArray(exceptionResponse['message'])) {
            responseStruct.msg = exceptionResponse['message'][0] || '';
          } else if (isString(exceptionResponse['message'])) {
            responseStruct.msg = exceptionResponse['message'];
          }
        }
      }
      response.json(responseStruct);
    } else {
      response.status(code);
      response.send(exception.message);
    }
  }
}
