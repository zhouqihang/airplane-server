import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClientException } from 'src/common/exceptions/client.exception';
import { EUserStatus } from 'src/users/types';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

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
    // TODO 设置session
    return randomUUID();
  }

  async logout(sessionId: string) {
    // TODO 清除redis session
    return true;
  }
}
