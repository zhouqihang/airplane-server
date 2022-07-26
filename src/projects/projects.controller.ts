import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SearchProjectDto } from './dto/search-project.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { UpdateUserProjectDto } from 'src/common/dtos/update-user-project.dto';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @User() user: UserEntity,
  ) {
    return await this.projectsService.create(createProjectDto, user);
  }

  @Get()
  async findAll(
    @Query() searchProjectDto: SearchProjectDto,
    @User('id') userId: number,
  ) {
    return await this.projectsService.findAll(searchProjectDto, userId);
  }

  @Get('/self')
  async findSelfPro(@User('id') userId: number) {
    return await this.projectsService.findSelfPro(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @User('id') userId: number) {
    return await this.projectsService.findOne(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @User('id') userId: number,
  ) {
    return await this.projectsService.update(id, updateProjectDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @User('id') userId: number) {
    return await this.projectsService.remove(id, userId);
  }

  @Get(':id/users')
  async projectUsers(@Param('id') id: number, @User('id') userId: number) {
    return await this.projectsService.projectUsers(id, [userId]);
  }

  @Post(':id/users')
  async updateProjectUsers(
    @Param('id') id: number,
    @Body() userProjectDto: UpdateUserProjectDto,
  ) {
    return await this.projectsService.updateProjectUsers(id, userProjectDto);
  }

  @Delete(':id/users/:mapId')
  async removeProjectUsers(
    @Param('id') id: number,
    @Param('mapId') mapId: number,
  ) {
    return await this.projectsService.removeProjectUsers(id, mapId);
  }
}
