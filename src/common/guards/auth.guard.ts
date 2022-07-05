import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientException } from '../exceptions/client.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const sessionId = req.cookies.session_id;
    if (!sessionId) {
      throw new ClientException(ClientException.responseCode.not_login);
    }
    // TODO 校验redis key
    return true;
  }
}
