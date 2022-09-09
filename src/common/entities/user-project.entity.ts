import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { ERole } from '../consts/role-enum';

@Entity('user_projects_project_users')
export class UserProject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @RelationId((up: UserProject) => up.user)
  userId: number;

  @ManyToOne(() => Project, (project) => project.usersProjectsMap)
  project: Project;

  @RelationId((up: UserProject) => up.project)
  projectId: number;

  @Column({
    type: 'enum',
    enum: ERole,
  })
  role: ERole;
}
