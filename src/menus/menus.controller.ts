import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SearchMenuDto } from './dto/search-menu.dto';
import { AllMenuDto } from './dto/all-menu.dto';
import { projectGuardCreator } from 'src/common/guards/project.guard';
import { ERole } from 'src/common/consts/role-enum';

@Controller('projects/:projectId/menus')
@UseGuards(
  AuthGuard,
  projectGuardCreator(ERole.project_dev, ERole.project_manage),
)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  async create(
    @Body() createMenuDto: CreateMenuDto,
    @Param('projectId') projectId: number,
  ) {
    return await this.menusService.create(createMenuDto, projectId);
  }

  /**
   * 分页查询菜单列表
   * @param searchMenuDto
   * @param user
   * @returns
   */
  @Get()
  async findByPage(
    @Query() searchMenuDto: SearchMenuDto,
    @Param('projectId') projectId: number,
  ) {
    return await this.menusService.findByPage(searchMenuDto, projectId);
  }

  @Get('all')
  async findAll(
    @Query() searchDto: AllMenuDto,
    @Param('projectId') projectId: number,
  ) {
    return await this.menusService.findAll(searchDto, projectId);
  }

  /**
   * 查询指定id的menu
   * @param id
   * @param user
   * @returns
   */
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.menusService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return await this.menusService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.menusService.remove(+id);
  }
}
