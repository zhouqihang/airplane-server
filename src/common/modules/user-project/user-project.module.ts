import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProject } from 'src/common/entities/user-project.entity';
import { UserProjectService } from './user-project.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProject])],
  providers: [UserProjectService],
  exports: [UserProjectService],
})
export class UserProjectModule {}
