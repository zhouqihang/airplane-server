import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseErrorFilter } from './common/filters/response-error.filter';
import { ResponseDataInterceptor } from './common/interceptors/response-data.interceptor';
import CONFIG from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // 开启白名单
      whitelist: true,
      // skipMissingProperties: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalInterceptors(
    // 统一响应结构
    new ResponseDataInterceptor(),
  );
  app.useGlobalFilters(
    // 拦截异常，输出异常结构
    new ResponseErrorFilter(),
  );
  await app.listen(CONFIG.port);
}
bootstrap();
