import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ERole } from 'src/common/consts/role-enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { projectGuardCreator } from 'src/common/guards/project.guard';
import { ProjectRequestService } from './project-request.service';
import { UpdateDto } from './dto/update.dto';

@Controller('projects/:projectId/request')
@UseGuards(
  AuthGuard,
  projectGuardCreator(ERole.project_dev, ERole.project_manage),
)
export class ProjectRequestController {
  constructor(private readonly service: ProjectRequestService) {}

  @Get()
  async getConfig(@Param('projectId') projectId: number) {
    return await this.service.getByProjectId(projectId);
  }

  @Patch()
  async updateConfig(
    @Body() dto: UpdateDto,
    @Param('projectId') projectId: number,
  ) {
    return await this.service.updateConfig(dto, projectId);
  }
}
