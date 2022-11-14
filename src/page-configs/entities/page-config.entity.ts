import { Page } from 'src/pages/entities/page.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('pageConfigs')
export class PageConfig {
  @PrimaryGeneratedColumn()
  id: number;

  // 操作人
  @ManyToOne(() => User, (user) => user.pages)
  updator: User;

  // 版本号
  @Column({ length: 64, default: '0.0.1', unique: true })
  version: string;

  // 属于哪个页面
  @ManyToOne(() => Page, (page) => page.configs)
  belongsToPage: Page;

  // 配置json
  // eg: { components: [] }
  @Column({ type: 'json' })
  jsonConfig: string;

  // 修改日期
  @Column({
    type: 'datetime',
    default: () => 'NOW()',
  })
  updateTime: string;

  @BeforeUpdate()
  onBeforeUpdate() {
    this.updateTime = new Date().toISOString();
  }
}
