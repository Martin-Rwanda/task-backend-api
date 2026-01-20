import { Module } from '@nestjs/common';
import { TaskAssignmentService } from './providers/task-assignments.service';
import { TaskAssignmentController } from './task-assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TaskAssignment } from './task-assignments.entity';
import { Task } from 'src/tasks/tasks.entity';
import { User } from 'src/users/users.entity';

@Module({
  providers: [TaskAssignmentService],
  controllers: [TaskAssignmentController],
  exports: [TaskAssignmentService],
  imports: [
    TypeOrmModule.forFeature([TaskAssignment, Task, User]),
    UsersModule
  ],
})
export class TaskAssignmentsModule {}
