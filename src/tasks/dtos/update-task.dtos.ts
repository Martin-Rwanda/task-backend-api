import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsOptional } from 'class-validator';
import * as tasksEntity from '../tasks.entity';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsEnum(['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED']) @IsOptional()
  status?: tasksEntity.TaskStatus;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']) @IsOptional()
  priority?: tasksEntity.TaskPriority;
}