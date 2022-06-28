import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EUserStatus } from '../types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  account: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  status: EUserStatus;

  // @Column()
  // createTime: any;

  // @Column()
  // updateTime: any;
}
