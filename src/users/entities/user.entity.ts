import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  BaseEntity,
} from 'typeorm';
import { EUserStatus } from '../types';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  username: string;

  @Column({ length: 16, unique: true })
  account: string;

  @Column({ length: 128 })
  password: string;

  @Column({ length: 64, nullable: false })
  email: string;

  @Column({
    type: 'enum',
    enum: EUserStatus,
    default: EUserStatus.disabled,
  })
  status: EUserStatus;

  @Column({ type: 'boolean', default: false })
  softRemoved: boolean;

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
  @BeforeUpdate()
  beforeSoftRemove() {
    if (this.softRemoved) {
      this.status = EUserStatus.disabled;
    }
  }

  getUserRO() {
    delete this.password;
    delete this.softRemoved;
    return this;
  }
}
