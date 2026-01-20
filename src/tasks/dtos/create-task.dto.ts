import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';
import * as tasksEntity from '../tasks.entity';

export class CreateTaskDto {
 @IsString() @IsNotEmpty()
  title: string;

  @IsString() @IsOptional()
  description?: string;

  @IsNumber()
  boardId: number;

  @IsNumber() @IsOptional()
  assignedToId?: number;

  @IsDateString() @IsOptional()
  dueDate?: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']) @IsOptional()
  priority?: tasksEntity.TaskPriority;
}