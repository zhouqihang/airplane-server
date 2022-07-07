import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EProjectStatus } from '../types';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true })
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

  @BeforeUpdate()
  onBeforeUpdate() {
    this.updateTime = new Date().toISOString();
  }
}
