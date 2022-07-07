import { Module } from '@nestjs/common';
import { RedisModule } from 'src/common/modules/redis/redis.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, RedisModule.forFeature()],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
