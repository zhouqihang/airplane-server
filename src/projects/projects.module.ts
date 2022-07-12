import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserProject } from 'src/common/entities/user-project.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, UserProject, User])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
