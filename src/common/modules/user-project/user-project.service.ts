import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProject } from 'src/common/entities/user-project.entity';
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

  async updateByProject(id: number) {
    return true;
  }
}
