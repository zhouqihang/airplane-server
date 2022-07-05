import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Cookies } from 'src/common/decorators/cookie. decorator';
import CONFIG from 'src/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const datetime = Date.now() + CONFIG.cookie_expires * 60 * 60 * 1000;
    response.cookie('session_id', await this.authService.login(loginDto), {
      expires: new Date(datetime),
    });
    return true;
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Cookies('session_id') sessionId: string,
  ) {
    await this.authService.logout(sessionId);
    response.cookie('session_id', '', { expires: new Date() });
    return true;
  }
}
