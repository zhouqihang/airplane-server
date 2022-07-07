import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientException } from 'src/common/exceptions/client.exception';
import { Pagination } from 'src/common/types/pagination';
import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { SearchProjectDto } from './dto/search-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}
  async create(createProjectDto: CreateProjectDto) {
    if (await this.nameAlreadyExist(createProjectDto.name)) {
      throw new ClientException(ClientException.responseCode.record_exist);
    }

    const project = new Project();
    project.name = createProjectDto.name;
    project.desc = createProjectDto.desc;
    project.status = createProjectDto.status;
    await this.projectRepository.save(project);
    return project;
  }

  async findAll(searchProjectDto: SearchProjectDto) {
    const where: FindOptionsWhere<Project> = {};
    if (searchProjectDto.name) {
      where.name = Like(`%${searchProjectDto.name}%`);
    }

    const { page, pageSize } = searchProjectDto;
    const [projects, count] = await this.projectRepository.findAndCount({
      where,
      skip: pageSize * (page - 1),
      take: pageSize,
      order: {
        status: 'ASC',
      },
    });
    return new Pagination(projects, count, searchProjectDto);
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new ClientException(ClientException.responseCode.record_not_exist);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);
    Object.keys(updateProjectDto).forEach((key) => {
      project[key] = updateProjectDto[key];
    });
    await this.projectRepository.save(project);
    return project;
  }

  async remove(id: number) {
    const res = await this.projectRepository.delete({ id });
    return !!res.raw;
  }

  async nameAlreadyExist(name: string) {
    const project = await this.projectRepository.findOneBy({ name });
    return !!project;
  }
}
