import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProject } from 'src/common/entities/user-project.entity';
import { ClientException } from 'src/common/exceptions/client.exception';
import { Repository } from 'typeorm';

@Injectable()
export class UserProjectService {
  constructor(
    @InjectRepository(UserProject)
    private userProjectRepository: Repository<UserProject>,
  ) {}

  async findByProject(id: number) {
    return await this.userProjectRepository
      .createQueryBuilder('map')
      .where('map.projectId = :projectId', { projectId: id })
      .getMany();
  }

  async findByUser(id: number) {
    return await this.userProjectRepository
      .createQueryBuilder('map')
      .where('map.userId = :uderId', { userId: id })
      .getMany();
  }
  /**
   * 查询user在某个Project里的权限
   * @param userId number
   * @param projectId number
   */
  async getUserRoleInProject(userId: number, projectId: number) {
    const res = await this.userProjectRepository.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId },
      },
    });
    if (!res) {
      throw new ClientException(ClientException.responseCode.record_not_exist);
    }
    return res.role;
  }
}
