import { IsNumber, IsOptional, IsEnum } from 'class-validator';

export enum TaskAssignmentRole {
  ASSIGNEE = 'ASSIGNEE',
  REVIEWER = 'REVIEWER',
  WATCHER = 'WATCHER',
}

export class AssignTaskDto {
  @IsNumber()
  taskId: number;

  @IsNumber()
  userId: number;

  @IsEnum(TaskAssignmentRole)
  @IsOptional()
  role?: TaskAssignmentRole = TaskAssignmentRole.ASSIGNEE;
}