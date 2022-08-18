import { UserProject } from 'src/common/entities/user-project.entity';
import { Menu } from 'src/menus/entities/menu.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EProjectStatus } from '../types';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true, nullable: false })
  name: string;

  @Column({ length: 256 })
  desc: string;

  @Column({
    type: 'enum',
    enum: EProjectStatus,
    default: EProjectStatus.enabled,
  })
  status: EProjectStatus;

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

  @Column({
    type: 'boolean',
    default: false,
  })
  softRemoved: boolean;

  @OneToMany(() => UserProject, (userProject) => userProject.project)
  @JoinColumn()
  usersProjectsMap: UserProject[];

  @OneToMany(() => Menu, (menu) => menu.project)
  menus: Menu[];

  @BeforeUpdate()
  onBeforeUpdate() {
    this.updateTime = new Date().toISOString();
  }

  @BeforeUpdate()
  beforeSoftRemoved() {
    if (this.softRemoved) {
      this.status = EProjectStatus.disabled;
    }
  }
}
