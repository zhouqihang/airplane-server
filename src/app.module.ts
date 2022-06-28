import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import config from './config';

const ORMModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: config.db_host,
  port: config.db_port,
  username: config.db_username,
  password: config.db_pwd,
  database: config.db_database,
  entities: [User],
  synchronize: true,
});

@Module({
  imports: [UsersModule, ORMModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
