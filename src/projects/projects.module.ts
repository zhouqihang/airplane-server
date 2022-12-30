import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserProject } from 'src/common/entities/user-project.entity';
import { User } from 'src/users/entities/user.entity';
import { UserProjectModule } from 'src/common/modules/user-project/user-project.module';
import { UserProjectService } from 'src/common/modules/user-project/user-project.service';
import { PageConfig } from 'src/page-configs/entities/page-config.entity';
import { Page } from 'src/pages/entities/page.entity';
import { ProjectsPreviewController } from './projects.noauth.controller';
import { Menu } from 'src/menus/entities/menu.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      UserProject,
      User,
      PageConfig,
      Page,
      Menu,
    ]),
    UserProjectModule,
  ],
  controllers: [ProjectsController, ProjectsPreviewController],
  providers: [ProjectsService, UserProjectService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
