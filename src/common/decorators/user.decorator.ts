import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from 'src/users/entities/user.entity';

export const User = createParamDecorator(async function (
  data: string,
  ctx: ExecutionContext,
) {
  const request = ctx.switchToHttp().getRequest();
  const sessionId = request.cookies.session_id;
  // TODO 从redis获取uid
  const uid = 5;
  const u = await UserEntity.findOneBy({ id: 15 });
  if (!u) {
    return data ? '' : {};
  }
  return data ? u[data] : u;
});
