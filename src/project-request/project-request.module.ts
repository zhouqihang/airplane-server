import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { ProjectRequest } from './entities/project-request.entity';
import { ProjectRequestController } from './project-request.controller';
import { ProjectRequestService } from './project-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRequest, Project])],
  controllers: [ProjectRequestController],
  providers: [ProjectRequestService],
  exports: [],
})
export class ProjectRequestModule {}
