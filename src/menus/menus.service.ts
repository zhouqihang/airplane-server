import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERole } from 'src/common/consts/role-enum';
import { ClientException } from 'src/common/exceptions/client.exception';
import { mapDto2Where } from 'src/common/helpers/map-dto-where';
import { UserProjectService } from 'src/common/modules/user-project/user-project.service';
import { EStatus } from 'src/common/types/enum';
import { Pagination } from 'src/common/types/pagination';
import { ProjectsService } from 'src/projects/projects.service';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { AllMenuDto } from './dto/all-menu.dto';
import { CreateMenuDto } from './dto/create-menu.dto';
import { SearchMenuDto } from './dto/search-menu.dto';
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
  async create(createMenuDto: CreateMenuDto, projectId: number) {
    const menu = new Menu();
    menu.title = createMenuDto.title;
    menu.routerName = createMenuDto.routerName;
    if (createMenuDto.query) {
      menu.query = createMenuDto.query;
    }
    menu.status = createMenuDto.status;
    menu.parentMenu = createMenuDto.parentMenu;
    menu.project = await this.project.findOneWithoutRole(projectId);
    return await this.menuRepository.save(menu);
  }

  async findByPage(searchMenuDto: SearchMenuDto, projectId: number) {
    const { page, pageSize } = searchMenuDto;
    let query = `select main.*, sub.title as parentMenu from menus main left join menus sub on main.parentMenu = sub.id where 1 `;
    let countQuery = `select count(title) as count from menus where 1 `;
    query += `and main.projectId = ${projectId} `;
    if (searchMenuDto.title) {
      query += `and main.title like '%${searchMenuDto.title}%' `;
      countQuery += `and title like '%${searchMenuDto.title}%' `;
    }
    if (searchMenuDto.status) {
      query += `and main.status = ${searchMenuDto.status} `;
      countQuery += `and status = ${searchMenuDto.status} `;
    }
    query += `order by main.updateTime DESC, main.status ASC `;
    query += `limit ${(page - 1) * pageSize}, ${pageSize}`;
    const res = await this.menuRepository.manager.query(query);
    const countRes = await this.menuRepository.manager.query(countQuery);
    return new Pagination(
      res.map((item) => Object.assign(item, { status: Number(item.status) })),
      Number(countRes[0].count),
      searchMenuDto,
    );
  }

  async findAll(dto: AllMenuDto, projectId: number) {
    const where: FindOptionsWhere<Menu> = {
      project: { id: projectId },
    };
    if (dto.status) {
      where.status = dto.status;
    }
    if (dto.belongsTo) {
      where.parentMenu = dto.belongsTo;
    }
    return await this.menuRepository.findBy(where);
  }

  async findOne(id: number) {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!menu) {
      throw new ClientException(ClientException.responseCode.record_not_exist);
    }
    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    let menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!menu) {
      throw new ClientException(ClientException.responseCode.record_not_exist);
    }
    mapDto2Where(updateMenuDto, menu, [
      'title',
      'status',
      'routerName',
      'query',
    ]);
    // 检查是否拥有要修改 menu 的权限
    if (updateMenuDto.parentMenu && updateMenuDto.parentMenu !== -1) {
      const parentMenu = await this.menuRepository.findOne({
        where: { id: updateMenuDto.parentMenu },
        relations: ['project'],
      });
      if (!parentMenu || parentMenu.project.id !== menu.project.id) {
        throw new ClientException(ClientException.responseCode.forbidden);
      }
    }
    menu.parentMenu = updateMenuDto.parentMenu;
    menu = await this.menuRepository.save(menu);
    return menu;
  }

  async remove(id: number) {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    await this.menuRepository.delete({ id: menu.id });
    return true;
  }
}
