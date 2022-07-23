import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientException } from 'src/common/exceptions/client.exception';
import { Pagination } from 'src/common/types/pagination';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { SearchProjectDto } from './dto/search-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { UserProject } from 'src/common/entities/user-project.entity';
import { ERole } from 'src/common/consts/role-enum';
import { User as UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(UserProject)
    private mapRepository: Repository<UserProject>,
  ) {}
  async create(createProjectDto: CreateProjectDto, user: UserEntity) {
    if (await this.nameAlreadyExist(createProjectDto.name)) {
      throw new ClientException(ClientException.responseCode.record_exist);
    }

    const project = new Project();
    project.name = createProjectDto.name;
    project.desc = createProjectDto.desc;
    project.status = createProjectDto.status;
    await this.projectRepository.save(project);

    const userProject = new UserProject();
    userProject.user = user;
    userProject.project = project;
    userProject.role = ERole.project_manage;
    await this.mapRepository.save(userProject);
    return project;
  }

  async findAll(searchProjectDto: SearchProjectDto, userId: number) {
    const where: FindOptionsWhere<Project> = {};
    if (searchProjectDto.name) {
      where.name = Like(`%${searchProjectDto.name}%`);
    }
    if (searchProjectDto.status) {
      where.status = searchProjectDto.status;
    }

    const { page, pageSize } = searchProjectDto;
    const qb = this.projectRepository.createQueryBuilder('project');
    const [projects, count] = await qb
      .leftJoinAndSelect('project.usersProjectsMap', 'project_user_map')
      .where(where)
      .andWhere('project_user_map.userId = :userId', { userId })
      .andWhere('project_user_map.role = :role', { role: ERole.project_manage })
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .orderBy('project.status', 'ASC')
      .getManyAndCount();
    return new Pagination(projects, count, searchProjectDto);
  }

  async findOne(id: number, userId) {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.usersProjectsMap', 'project_user_map')
      .where({ id })
      .andWhere('project_user_map.userId = :userId', { userId })
      .andWhere('project_user_map.role = :role', {
        role: ERole.project_manage,
      })
      .getOne();

    if (!project) {
      throw new ClientException(ClientException.responseCode.record_not_exist);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number) {
    const project = await this.findOne(id, userId);
    Object.keys(updateProjectDto).forEach((key) => {
      project[key] = updateProjectDto[key];
    });
    await this.projectRepository.save(project);
    return project;
  }

  async remove(id: number, userId: number) {
    const project = await this.findOne(id, userId);
    const res = await this.projectRepository.delete({ id: project.id });
    return !!res.raw;
  }

  async nameAlreadyExist(name: string) {
    const project = await this.projectRepository.findOneBy({ name });
    return !!project;
  }

  async findSelfPro(userId: number) {
    const qb = this.projectRepository.createQueryBuilder('project');
    const projects = await qb
      .leftJoinAndSelect('project.usersProjectsMap', 'project_user_map')
      .where('project_user_map.userId = :userId', { userId })
      .orderBy('project.status', 'ASC')
      .getMany();
    return projects.map(({ usersProjectsMap, ...others }) => {
      return {
        ...others,
        role: usersProjectsMap[0].role,
      };
    });
  }
}
