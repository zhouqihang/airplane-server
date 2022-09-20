import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ERole } from 'src/common/consts/role-enum';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { projectGuardCreator } from 'src/common/guards/project.guard';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { SearchPageDto } from './dto/search-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PagesService } from './pages.service';

@Controller('projects/:projectId/pages')
@UseGuards(
  AuthGuard,
  projectGuardCreator(ERole.project_dev, ERole.project_manage),
)
export class PagesController {
  constructor(private pageService: PagesService) {}
  @Get()
  async getByPage(@Query() dto: SearchPageDto) {
    return await this.pageService.findByPage(dto);
  }

  @Post()
  async create(@Body() createDto: CreatePageDto, @User() user: UserEntity) {
    return await this.pageService.create(createDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.pageService.removeById(id);
  }

  @Patch(':id')
  async update(
    @Body() updateDto: UpdatePageDto,
    @Param('id') id: number,
    @User() user: UserEntity,
  ) {
    return await this.pageService.updateById(updateDto, id, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.pageService.findOne(id);
  }
}
