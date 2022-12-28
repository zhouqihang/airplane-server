import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientException } from 'src/common/exceptions/client.exception';
import { EStatus } from 'src/common/types/enum';
import { Pagination } from 'src/common/types/pagination';
import { User } from 'src/users/entities/user.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';
import { SearchPageDto } from './dto/search-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page) private pagesRepository: Repository<Page>,
  ) {}

  async create(dto: CreatePageDto, user: User) {
    const page = new Page();
    page.pageName = dto.pageName;
    page.pageRouter = dto.pageRouter;
    page.pagePath = dto.pagePath;
    page.status = dto.status;
    page.updator = user;
    return await this.pagesRepository.save(page);
  }

  async removeById(id: number) {
    const page = await this.pagesRepository.findOne({
      where: {
        id,
      },
      relations: ['menus'],
    });
    if (!page) {
      throw new ClientException(ClientException.responseCode.record_not_exist);
    }
    page.menus = [];
    await this.pagesRepository.manager.transaction(async (entityManager) => {
      await entityManager.save(page);
      await entityManager.delete<Page>(Page, { id });
    });
    return true;
  }

  async updateById(updateDto: UpdatePageDto, id: number, user: User) {
    const page = await this.pagesRepository.findOneBy({ id });
    if (!page) {
      throw new ClientException(ClientException.responseCode.record_not_exist);
    }
    if (updateDto.pageName) {
      page.pageName = updateDto.pageName;
    }
    if (updateDto.pageRouter) {
      page.pageRouter = updateDto.pageRouter;
    }
    if (updateDto.pagePath) {
      page.pagePath = updateDto.pagePath;
    }
    if (updateDto.status) {
      page.status = updateDto.status;
    }
    page.updator = user;
    await this.pagesRepository.save(page);
    return page;
  }

  async findByPage(dto: SearchPageDto) {
    const where: FindOptionsWhere<Page> = {};
    if (dto.pageName) {
      where.pageName = Like(`%${dto.pageName}%`);
    }
    if (dto.status) {
      where.status = dto.status as EStatus;
    }
    if (dto.menu) {
      where.menus = { id: parseInt(dto.menu, 10) };
    }
    const [pages, count] = await this.pagesRepository.findAndCount({
      where,
      take: dto.pageSize,
      skip: dto.pageSize * (dto.page - 1),
      order: {
        updateTime: 'DESC',
      },
      relations: ['updator', 'menus'],
    });
    return new Pagination(pages, count, dto);
  }
  async findOne(pageId: number) {
    const page = await this.pagesRepository.findOneBy({ id: pageId });
    if (!page) {
      throw new ClientException(ClientException.responseCode.record_not_exist);
    }
    return page;
  }
  async findAll(projectId: number) {
    const pages = await this.pagesRepository.find({
      where: {
        project: { id: projectId },
      },
    });

    return pages;
  }
}
