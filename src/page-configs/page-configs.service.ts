import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientException } from 'src/common/exceptions/client.exception';
import { PagesService } from 'src/pages/pages.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePageConfigDto } from './dto/create-page-config.dto';
import { UpdatePageConfigDto } from './dto/update-page-config.dto';
import { PageConfig } from './entities/page-config.entity';

@Injectable()
export class PageConfigsService {
  constructor(
    @InjectRepository(PageConfig) private repo: Repository<PageConfig>,
    private pageService: PagesService,
  ) {}

  async create(createPageConfigDto: CreatePageConfigDto, user: User) {
    // 验证版本号是否合法且有效
    const latestVersion = await this.getNextVersion(createPageConfigDto.pageId);
    if (!this.isVaildVersion(latestVersion, createPageConfigDto.version)) {
      throw ClientException.InitParamsErr(
        `The version number must be at least "${latestVersion}"`,
      );
    }
    const page = await this.pageService.findOne(createPageConfigDto.pageId);
    const config = new PageConfig();
    config.belongsToPage = page;
    config.jsonConfig = createPageConfigDto.jsonConfig;
    config.version = createPageConfigDto.version;
    config.updator = user;

    return await this.repo.save(config);
  }

  findAll() {
    return `This action returns all pageConfigs`;
  }

  async findOne(pageId: number, id?: number) {
    if (!id) {
      const res = await this.repo.find({
        where: {
          belongsToPage: { id: pageId },
        },
        order: {
          updateTime: 'DESC',
        },
        take: 1,
      });
      if (res && res.length) {
        return res.pop();
      }
      return null;
    }
    return await this.repo.findOneBy({ id });
  }

  update(id: number, updatePageConfigDto: UpdatePageConfigDto) {
    return `This action updates a #${id} pageConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} pageConfig`;
  }

  async getNextVersion(pageId: number) {
    const config = await this.repo.find({
      where: {
        belongsToPage: { id: pageId },
      },
      order: {
        updateTime: 'DESC',
      },
      take: 1,
    });
    if (!config || !config.length) return '0.0.1';
    const latest = config.pop();
    const [major, minor, patch] = latest.version.split('.');
    return `${major}.${minor}.${+patch + 1}`;
  }

  isVaildVersion(current: string, input: string) {
    const currentVersions = current.split('.');
    const inputVersions = input.split('.');
    for (let i = 0; i < inputVersions.length; i++) {
      if (+inputVersions[i] < +currentVersions[i]) {
        return false;
      }
    }
    return true;
  }
}
