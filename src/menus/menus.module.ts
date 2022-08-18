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

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, UserProject, Project]),
    UserProjectModule,
    ProjectsModule,
  ],
  controllers: [MenusController],
  providers: [MenusService, UserProjectService, ProjectsService],
})
export class MenusModule {}
