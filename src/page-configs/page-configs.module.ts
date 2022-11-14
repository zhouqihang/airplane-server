import { Module } from '@nestjs/common';
import { PageConfigsService } from './page-configs.service';
import { PageConfigsController } from './page-configs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageConfig } from './entities/page-config.entity';
import { PagesService } from 'src/pages/pages.service';
import { Page } from 'src/pages/entities/page.entity';
import { User } from 'src/users/entities/user.entity';
import { PagesModule } from 'src/pages/pages.module';

@Module({
  imports: [TypeOrmModule.forFeature([PageConfig, Page, User]), PagesModule],
  controllers: [PageConfigsController],
  providers: [PageConfigsService, PagesService],
})
export class PageConfigsModule {}
