import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERole } from 'src/common/consts/role-enum';
import { ClientException } from 'src/common/exceptions/client.exception';
import { mapDto2Where } from 'src/common/helpers/map-dto-where';
import { UserProjectService } from 'src/common/modules/user-project/user-project.service';
import { ProjectsService } from 'src/projects/projects.service';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenusService {
  constructor(
    private userProject: UserProjectService,
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    private project: ProjectsService,
  ) {}
  /**
   * 创建一个新的 menu
   * @param createMenuDto CreateMenuDto
   * @param userId userId
   * @returns Promise
   */
  async create(createMenuDto: CreateMenuDto, userId: number) {
    // 获取当前用户是否有某个项目的权限
    const role = await this.userProject.getUserRoleInProject(
      userId,
      createMenuDto.projectId,
    );
    if (role === ERole.project_op) {
      throw new ClientException(ClientException.responseCode.permission_denied);
    }

    const menu = new Menu();
    menu.title = createMenuDto.title;
    menu.routerName = createMenuDto.routerName;
    if (createMenuDto.query) {
      menu.query = createMenuDto.query;
    }
    menu.status = createMenuDto.status;
    menu.parentMenu = createMenuDto.parentMenu;
    menu.project = await this.project.findOne(createMenuDto.projectId, userId);
    return await this.menuRepository.save(menu);
  }

  findAll() {
    return `This action returns all menus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
