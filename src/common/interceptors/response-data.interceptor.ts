import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, tap } from 'rxjs';
import { ResponseStruct } from '../types/response-struct';

export class ResponseDataInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(function (val) {
        return new ResponseStruct(val);
      }),
    );
  }
}
