import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PageConfigsService } from './page-configs.service';
import { CreatePageConfigDto } from './dto/create-page-config.dto';
import { UpdatePageConfigDto } from './dto/update-page-config.dto';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { projectGuardCreator } from 'src/common/guards/project.guard';
import { ERole } from 'src/common/consts/role-enum';

@Controller('projects/:projectId/pages/:pageId/page-configs')
@UseGuards(
  AuthGuard,
  projectGuardCreator(ERole.project_dev, ERole.project_manage),
)
export class PageConfigsController {
  constructor(private readonly pageConfigsService: PageConfigsService) {}

  @Post()
  create(
    @Body() createPageConfigDto: CreatePageConfigDto,
    @User() user: UserEntity,
  ) {
    return this.pageConfigsService.create(createPageConfigDto, user);
  }

  /**
   * 查找某个page下所有的发布记录
   * @returns
   */
  @Get()
  findAll() {
    return this.pageConfigsService.findAll();
  }

  /**
   * 查找某个page的一个具体版本配置
   * @param id {number}
   * @returns
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pageConfigsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePageConfigDto: UpdatePageConfigDto,
  ) {
    return this.pageConfigsService.update(+id, updatePageConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pageConfigsService.remove(+id);
  }

  @Post('nextVersion')
  getNextVersion(@Param('pageId') pageId: number) {
    return this.pageConfigsService.getNextVersion(pageId);
  }
}
