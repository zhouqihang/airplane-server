import { EStatus } from 'src/common/types/enum';
import { Menu } from 'src/menus/entities/menu.entity';
import { PageConfig } from 'src/page-configs/entities/page-config.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, nullable: false })
  pageName: string;

  @Column({ length: 128, nullable: false, unique: true })
  pageRouter: string;

  @Column({ length: 128, nullable: false, unique: true })
  pagePath: string;

  // @Column()
  // version: string;

  // @Column()
  // latestVersion: string;

  @Column({ type: 'enum', enum: EStatus })
  status: EStatus;

  // @Column({ type: 'json' })
  // config: string;

  // 关联User
  @ManyToOne(() => User, (user) => user.pages)
  updator: User;

  @OneToMany(() => Menu, (menu) => menu.page, { cascade: true })
  menus: Menu[];

  @ManyToOne(() => Project, (project) => project.pages)
  project: Project;

  // 关联页面配置
  @OneToMany(() => PageConfig, (pageConfig) => pageConfig.belongsToPage)
  configs: PageConfig[];

  @Column({
    type: 'datetime',
    default: () => 'NOW()',
  })
  createTime: string;

  @Column({
    type: 'datetime',
    default: () => 'NOW()',
  })
  updateTime: string;

  @BeforeUpdate()
  onBeforeUpdate() {
    this.updateTime = new Date().toISOString();
  }

  // TODO 关联变更记录
  // TODO 更新前改动变更记录
}
