import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { UserProjectModule } from 'src/common/modules/user-project/user-project.module';
import { UserProjectService } from 'src/common/modules/user-project/user-project.service';
import { UserProject } from 'src/common/entities/user-project.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectsService } from 'src/projects/projects.service';
import { Project } from 'src/projects/entities/project.entity';
import { PagesModule } from 'src/pages/pages.module';
import { PagesService } from 'src/pages/pages.service';
import { Page } from 'src/pages/entities/page.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, UserProject, Project, Page]),
    UserProjectModule,
    ProjectsModule,
    PagesModule,
  ],
  controllers: [MenusController],
  providers: [MenusService, UserProjectService, ProjectsService, PagesService],
})
export class MenusModule {}
