import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClientException } from 'src/common/exceptions/client.exception';
import config from 'src/config';
import { RedisService } from 'src/common/modules/redis/redis.service';
import { EUserStatus } from 'src/users/types';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly redis: RedisService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByAccount(loginDto.account);
    if (!user) {
      throw new ClientException(ClientException.responseCode.auth_login_err);
    }
    if (user.password !== loginDto.password) {
      throw new ClientException(ClientException.responseCode.auth_login_err);
    }
    if (user.softRemoved || user.status == EUserStatus.disabled) {
      throw new ClientException(ClientException.responseCode.user_disabled);
    }
    const sessionId = randomUUID();
    await this.redis.set(sessionId, '' + user.id, config.redis_expires);
    return sessionId;
  }

  async logout(sessionId: string) {
    await this.redis.del(sessionId);
    return true;
  }

  async hasLogin(sessionId: string) {
    if (!sessionId) return false;
    const userId = this.redis.get(sessionId);
    return !!userId;
  }
}
