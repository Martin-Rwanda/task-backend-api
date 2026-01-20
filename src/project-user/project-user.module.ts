import { Module } from '@nestjs/common';
import { ProjectUserService } from './providers/project-user.service';
import { ProjectUserController } from './project-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module';
import { ProjectUser } from './project-user.entity';
import { Project } from 'src/projects/projects.entity';
import { User } from 'src/users/users.entity';
import { Role } from 'src/roles/roles.entuty';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [ProjectUserService],
  controllers: [ProjectUserController],
  exports: [ProjectUserService],
  imports: [
      TypeOrmModule.forFeature([ProjectUser, Project, User, Role]),
      AuditLogsModule,
      UsersModule
    ],
})
export class ProjectUserModule {}
