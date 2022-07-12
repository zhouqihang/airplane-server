import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ERole } from '../consts/role-enum';

@Entity('user_projects_project_users')
export class UserProject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @ManyToOne(() => Project, (project) => project.usersProjectsMap)
  project: Project;

  @Column({
    type: 'enum',
    enum: ERole,
  })
  role: ERole;
}
