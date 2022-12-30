import { Controller, Get, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsPreviewController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * 获取某个项目的JSON配置
   */
  @Get(':id/conf')
  async getProjectConf(@Param('id') id: number) {
    return await this.projectsService.getProjectConf(id);
  }
}
