import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Repository } from 'typeorm';
import { ProjectRequest } from './entities/project-request.entity';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class ProjectRequestService {
  constructor(
    @InjectRepository(ProjectRequest) private repo: Repository<ProjectRequest>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
  ) {}

  async getByProjectId(projectId: number) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['requestConfig'],
    });
    if (project.requestConfig) {
      return project.requestConfig;
    }
    project.requestConfig = ProjectRequest.init();
    await this.projectRepo.save(project);
    return project.requestConfig;
  }

  async updateConfig(dto: UpdateDto, projectId: number) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['requestConfig'],
    });
    const config = project.requestConfig;
    Object.keys(dto).forEach((key) => {
      config[key] = dto[key];
    });
    return await this.repo.save(config);
  }
}
