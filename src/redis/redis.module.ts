import { DynamicModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisClientService } from './redis-client.service';
import { IRedisClientConfig } from './types';

@Module({})
export class RedisModule {
  static forRoot(options?: IRedisClientConfig): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        RedisClientService,
      ],
      exports: [RedisClientService],
    };
  }
  static forFeature(): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        // {
        //   provide: 'CONFIG_OPTIONS',
        //   useValue: null,
        // },
        RedisService,
        RedisClientService,
      ],
      exports: [RedisService],
    };
  }
}
