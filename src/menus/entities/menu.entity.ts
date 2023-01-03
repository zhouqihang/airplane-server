import { EStatus } from 'src/common/types/enum';
import { Page } from 'src/pages/entities/page.entity';
import { Project } from 'src/projects/entities/project.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, unique: true, nullable: false })
  title: string;

  @Column({ type: 'json', default: null })
  query: string;

  @Column({ type: 'enum', enum: EStatus, default: EStatus.enabled })
  status: EStatus;

  @Column({ default: -1 })
  parentMenu: number;

  // menu和project一对多关系
  @ManyToOne(() => Project, (project) => project.menus)
  project: Project;
  // TODO 创建人和user一对多

  @ManyToOne(() => Page, (page) => page.menus)
  page: Page;

  @Column({
    type: 'datetime',
    default: () => 'NOW()',
  })
  createTime: string;

  @Column('datetime', { default: () => 'NOW()' })
  updateTime: string;

  @BeforeUpdate()
  setUpdateTime() {
    this.updateTime = new Date().toISOString();
  }
}
