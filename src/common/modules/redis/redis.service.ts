import { Injectable } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';

@Injectable()
export class RedisService {
  constructor(private readonly redis: RedisClientService) {}

  async get(key: string) {
    return await this.redis.getClient().get(key);
  }

  async set(key: string, val: string, exHours?: number) {
    await this.redis.getClient().set(key, val, {
      EX: exHours ? exHours * 60 * 60 : undefined,
    });
  }

  async del(key: string) {
    await this.redis.getClient().del(key);
  }
}
