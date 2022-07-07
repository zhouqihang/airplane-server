import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RedisClientService } from 'src/common/modules/redis/redis-client.service';
import { ClientException } from '../exceptions/client.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const sessionId = req.cookies.session_id;
    if (!sessionId) {
      throw new ClientException(ClientException.responseCode.not_login);
    }
    const uid = await RedisClientService.getClient().get(sessionId);
    if (!uid) {
      throw new ClientException(ClientException.responseCode.not_login);
    }
    return true;
  }
}
