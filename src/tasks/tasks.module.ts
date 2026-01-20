import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './providers/tasks.service';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Board } from 'src/boards/boards.entity';
import { TaskAssignmentsModule } from 'src/task-assignments/task-assignments.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
  imports: [
      TypeOrmModule.forFeature([Task, Board]),
      AuditLogsModule,
      TaskAssignmentsModule,
      UsersModule
    ],
})
export class TasksModule {}
