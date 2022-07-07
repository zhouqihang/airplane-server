import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  Optional,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { IRedisClientConfig } from './types';

@Injectable()
export class RedisClientService implements OnModuleDestroy {
  static defaultConfig: IRedisClientConfig = {
    username: '',
    password: '',
    port: 6379,
    host: 'localhost',
  };

  static getClient() {
    return RedisClientService.client;
  }

  private static client: RedisClientType | null = null;

  constructor(
    @Optional() @Inject('CONFIG_OPTIONS') options?: IRedisClientConfig,
  ) {
    if (!RedisClientService.client) {
      this.connect(options);
    }
  }
  onModuleDestroy() {
    RedisClientService.client.disconnect();
  }

  private async connect(options?: IRedisClientConfig) {
    const config = Object.assign(
      {},
      RedisClientService.defaultConfig,
      options || {},
    );
    let redisAuth = '';
    if (config.username && config.password) {
      redisAuth = config.username + ':' + config.password;
    }
    const url = `redis://${redisAuth}@${config.host}:${config.port}`;
    RedisClientService.client = createClient({ url });
    RedisClientService.client.on('error', async () => {
      Logger.error(
        `redis connect failed: ${url}, please check your config or redis server`,
      );
      await RedisClientService.client.disconnect();
    });
    await RedisClientService.client.connect();
  }

  getClient() {
    return RedisClientService.client;
  }
}
