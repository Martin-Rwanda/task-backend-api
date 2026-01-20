import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { AdminSeedModule } from './admin-seed/admin-seed.module';
import { PermissionsGuard } from './auth/guards/permission.guard';
import { ProjectsModule } from './projects/projects.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskAssignmentsModule } from './task-assignments/task-assignments.module';
import { CommentsModule } from './comments/comments.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ProjectUserModule } from './project-user/project-user.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [UsersModule, TypeOrmModule.forRootAsync({
    imports: [],
    inject: [],
    useFactory: () => ({
      type: "postgres",
      // entities: [User],
      autoLoadEntities:true,
      synchronize: true,
      port:5432,
      username: 'postgres',
      password: '02011997',
      host: 'localhost',
      database: 'task_management_nest'
    })
  }), RolesModule, PermissionsModule, AuthModule, AdminSeedModule, ProjectsModule, BoardsModule, TasksModule, TaskAssignmentsModule, CommentsModule, AuditLogsModule, ProjectUserModule],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    }],
})
export class AppModule {}
 providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    }
  ]