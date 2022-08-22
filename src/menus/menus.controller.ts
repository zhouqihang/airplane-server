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
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SearchMenuDto } from './dto/search-menu.dto';
import { AllMenuDto } from './dto/all-menu.dto';

@Controller('menus')
@UseGuards(AuthGuard)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  async create(@Body() createMenuDto: CreateMenuDto, @User() user: UserEntity) {
    return await this.menusService.create(createMenuDto, user.id);
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
    @User() user: UserEntity,
  ) {
    return await this.menusService.findByPage(searchMenuDto, user.id);
  }

  @Get('all')
  async findAll(@Query() searchDto: AllMenuDto, @User('id') userId: number) {
    return await this.menusService.findAll(searchDto, userId);
  }

  /**
   * 查询指定id的menu
   * @param id
   * @param user
   * @returns
   */
  @Get(':id')
  async findOne(@Param('id') id: number, @User() user: UserEntity) {
    return await this.menusService.findOne(+id, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
    @User('id') userId: number,
  ) {
    return await this.menusService.update(+id, updateMenuDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User('id') userId: number) {
    return await this.menusService.remove(+id, userId);
  }
}
