import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RedisClientService } from 'src/common/modules/redis/redis-client.service';
import { User as UserEntity } from 'src/users/entities/user.entity';

export const User = createParamDecorator(async function (
  data: string,
  ctx: ExecutionContext,
) {
  const request = ctx.switchToHttp().getRequest();
  const sessionId = request.cookies.session_id;
  const redis = RedisClientService.getClient();
  const uid = await redis.get(sessionId);
  const u = await UserEntity.findOneBy({ id: parseInt(uid) });
  if (!u) {
    return data ? '' : {};
  }
  return data ? u[data] : u;
});
