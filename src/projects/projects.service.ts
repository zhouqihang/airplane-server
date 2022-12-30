import { Injectable, Logger } from '@nestjs/common';
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
import { UserProjectService } from 'src/common/modules/user-project/user-project.service';
import { UpdateUserProjectDto } from 'src/common/dtos/update-user-project.dto';
import { EStatus } from 'src/common/types/enum';
import { Menu } from 'src/menus/entities/menu.entity';
import { Page } from 'src/pages/entities/page.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    @InjectRepository(Page) private pageRepository: Repository<Page>,
    @InjectRepository(UserProject)
    private mapRepository: Repository<UserProject>,
    private userProject: UserProjectService,
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
    const where: FindOptionsWhere<Project> = {
      softRemoved: false,
    };
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
      .where({ id, softRemoved: false })
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

  /**
   * 通过 projectid 查找一个project，不校验 role 和 userId
   * @param id projectId
   * @returns project
   */
  async findOneWithoutRole(id: number) {
    const project = await this.projectRepository.findOneBy({
      id,
    });
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
    project.softRemoved = true;
    await this.projectRepository.save(project);
    return true;
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
      .andWhere('project.softRemoved = :softRemoved', { softRemoved: false })
      .orderBy('project.status', 'ASC')
      .getMany();
    return projects.map(({ usersProjectsMap, ...others }) => {
      return {
        ...others,
        role: usersProjectsMap[0].role,
      };
    });
  }

  async projectUsers(id: number, excludeUsers: number[]) {
    const res = await this.userProject.findByProject(id);

    if (!res) {
      return [];
    }
    return res.filter((item) => !excludeUsers.includes(item.userId));
  }

  async updateProjectUsers(pid: number, userProjectDto: UpdateUserProjectDto) {
    if (userProjectDto.id) {
      // update
      const map = await this.mapRepository.findOneBy({ id: userProjectDto.id });
      map.role = userProjectDto.role;
      this.mapRepository.save(map);
      return true;
    } else {
      // create
      const has = await this.mapRepository.findOneBy({
        user: { id: userProjectDto.userId },
        project: { id: pid },
      });
      if (has) {
        throw new ClientException(ClientException.responseCode.record_exist);
      }
      const qb = this.mapRepository.createQueryBuilder();
      await qb
        .insert()
        .into(UserProject)
        .values({
          role: userProjectDto.role,
          user: { id: userProjectDto.userId },
          project: { id: pid },
        })
        .execute();
      return true;
    }
  }

  async removeProjectUsers(id: number, mapId: number) {
    const record = await this.mapRepository.findOneBy({ id: mapId });
    if (!record) {
      throw new ClientException(ClientException.responseCode.record_not_exist);
    }
    await this.mapRepository.delete({
      id: mapId,
    });
    return true;
  }

  /**
   * 获取指定project的完整配置
   */
  async getProjectConf(projectId: number) {
    // const project = await this.projectRepository.findOne({
    //   where: {
    //     id: projectId,
    //   },
    //   relations: ['pages'],
    // });
    const menus = await this.menuRepository.find({
      where: {
        project: { id: projectId },
        status: EStatus.enabled,
      },
      relations: ['page'],
    });
    const pages = await this.pageRepository.find({
      where: {
        project: { id: projectId },
        status: EStatus.enabled,
      },
      relations: ['configs'],
    });
    return {
      globalConfig: {},
      apisConfig: {},
      menusConfig: {
        children: menus,
      },
      pagesConfig: {
        children: pages.map((item) => {
          const page = Object.assign({ jsonConfig: null }, item);
          delete page.configs;
          if (item.configs[0]) {
            page.jsonConfig = item.configs[0].jsonConfig;
          } else {
            page.jsonConfig = { components: [] };
          }
          return page;
        }),
      },
    };
  }
}
