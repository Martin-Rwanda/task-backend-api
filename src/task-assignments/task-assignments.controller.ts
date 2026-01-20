import { Controller, Post, Delete, Get, Param, Body, UseGuards,} from '@nestjs/common';
import { TaskAssignmentService } from './providers/task-assignments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/require-permission.decorator';
import { AssignTaskDto } from './dtos/assign-task.dtos';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { User } from 'src/users/users.entity';

@Controller('task-assignments')
export class TaskAssignmentController {
  constructor(private readonly service: TaskAssignmentService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('ASSIGN_TASK')
  @Post()
  async assign(@Body() dto: AssignTaskDto, @RequestUser() user: User) {
    return this.service.assign(dto, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('REMOVE_TASK_ASSIGNMENT')
  @Delete(':id')
  async remove(@Param('id') id: number, @RequestUser() user: User) {
    return this.service.remove(id, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('VIEW_TASK_ASSIGNMENTS')
  @Get('task/:taskId')
  async getByTask(@Param('taskId') taskId: number, @RequestUser() user: User) {
    return this.service.getTaskAssignments(taskId, user);
  }
}