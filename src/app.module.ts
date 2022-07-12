import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './common/modules/redis/redis.module';
import { ProjectsModule } from './projects/projects.module';
import config from './config';
import { Project } from './projects/entities/project.entity';
import { UserProject } from './common/entities/user-project.entity';

const ORMModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: config.db_host,
  port: config.db_port,
  username: config.db_username,
  password: config.db_pwd,
  database: config.db_database,
  entities: [User, Project, UserProject],
  synchronize: true,
});

const UsedRedisModule = RedisModule.forRoot({
  username: config.redis_username,
  password: config.redis_password,
  port: config.redis_port,
  host: config.redis_host,
});

@Module({
  imports: [
    UsersModule,
    ORMModule,
    UsedRedisModule,
    AuthModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
