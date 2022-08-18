import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserProject } from 'src/common/entities/user-project.entity';
import { User } from 'src/users/entities/user.entity';
import { UserProjectModule } from 'src/common/modules/user-project/user-project.module';
import { UserProjectService } from 'src/common/modules/user-project/user-project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, UserProject, User]),
    UserProjectModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, UserProjectService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
