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
import { Menu } from './menus/entities/menu.entity';
import { PagesModule } from './pages/pages.module';
import { MenusModule } from './menus/menus.module';
import { Page } from './pages/entities/page.entity';
import { PageConfigsModule } from './page-configs/page-configs.module';
import { PageConfig } from './page-configs/entities/page-config.entity';
import { ProjectRequest } from './project-request/entities/project-request.entity';
import { ProjectRequestModule } from './project-request/project-request.module';

const ORMModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: config.db_host,
  port: config.db_port,
  username: config.db_username,
  password: config.db_pwd,
  database: config.db_database,
  entities: [
    User,
    Project,
    UserProject,
    Menu,
    Page,
    PageConfig,
    ProjectRequest,
  ],
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
    PagesModule,
    MenusModule,
    PageConfigsModule,
    ProjectRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
