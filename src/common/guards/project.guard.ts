import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ERole } from '../consts/role-enum';
import { UserProject } from '../entities/user-project.entity';
import { ClientException } from '../exceptions/client.exception';
import { RedisClientService } from '../modules/redis/redis-client.service';

/**
 * 创建一个Guard，用于判断当前登录用户，是否是指定project的指定role。用于权限控制
 * @param role ERole[]
 * @returns ProjectGuard
 */
export function ProjectGuardCreator(...role: ERole[]) {
  return class ProjectGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // 获取userId projectId
      const request = context.switchToHttp().getRequest();
      const sessionId = request.cookies.session_id;
      const redis = RedisClientService.getClient();
      const uid = await redis.get(sessionId);
      const projectId = request.params.projectId;
      if (!uid || !projectId) {
        throw new ClientException(
          ClientException.responseCode.permission_denied,
        );
      }

      const userProject = await UserProject.findOne({
        where: {
          project: { id: parseInt(projectId, 10) },
          user: { id: parseInt(uid, 10) },
        },
      });
      if (role.includes(userProject.role)) return true;

      throw new ClientException(ClientException.responseCode.permission_denied);
    }
  };
}
