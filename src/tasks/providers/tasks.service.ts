import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/tasks/tasks.entity';
import { Board } from 'src/boards/boards.entity';
import { User } from 'src/users/users.entity';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dtos';
import { UsersService } from 'src/users/providers/users.service';
import { TaskAssignmentService } from 'src/task-assignments/providers/task-assignments.service';
import { AuditLogService } from 'src/audit-logs/providers/audit-logs.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    private usersService: UsersService,
    private assignmentService: TaskAssignmentService,
    private auditLogService: AuditLogService,
  ) {}

  async create(dto: CreateTaskDto, user: User) {
    const board = await this.boardRepo.findOne({ where: { id: dto.boardId }, relations: ['project'] });
    if (!board) throw new NotFoundException('Board not found');

    const perms = await this.usersService.getEffectivePermissions(user.id, board.project.id);
    if (!perms.includes('CREATE_TASK')) throw new ForbiddenException('Insufficient permissions');

    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      priority: dto.priority || 'MEDIUM',
      board,
      project: board.project,
      createdBy: user,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined
    });

    const savedTask = await this.taskRepo.save(task);
    await this.auditLogService.log(user, 'CREATE', 'TASK', savedTask.id, `Task "${savedTask.title}" created`, savedTask);

    if (dto.assignedToId) {
      await this.assignmentService.assign({ taskId: savedTask.id, userId: dto.assignedToId }, user);
    }

    return savedTask;
  }
  async findAll(user: User) {
    // I will filter belongs to...
    return this.taskRepo.find({ relations: ['board', 'project', 'createdBy', 'assignments'] });
  }

  async findOne(id: number, user: User) {
    const task = await this.taskRepo.findOne({ where: { id }, relations: ['board', 'project', 'createdBy', 'assignments'] });
    if (!task) throw new NotFoundException('Task not found');

    const perms = await this.usersService.getEffectivePermissions(user.id, task.project.id);
    if (!perms.includes('VIEW_TASK')) throw new ForbiddenException('Insufficient permissions');

    return task;
  }

  async update(id: number, dto: UpdateTaskDto, user: User) {
    const task = await this.findOne(id, user);

    const perms = await this.usersService.getEffectivePermissions(user.id, task.project.id);
    if (!perms.includes('UPDATE_TASK')) throw new ForbiddenException('Insufficient permissions');

    if (dto.boardId) {
      const board = await this.boardRepo.findOne({ where: { id: dto.boardId }, relations: ['project'] });
      if (!board) throw new NotFoundException('Board not found');
      task.board = board;
      task.project = board.project;
    }
    const oldStatus = task.status

    Object.assign(task, dto);
    await this.auditLogService.log(user, 'UPDATE', 'TASK', task.id, `Task updated`, task);

    if (dto.status && dto.status !== oldStatus) {
      await this.auditLogService.log(user, 'STATUS_CHANGE', 'TASK', task.id, `Status changed from ${oldStatus} to ${dto.status}`, task);
    }
    return this.taskRepo.save(task);
  }

  async remove(id: number, user: User) {
    const task = await this.findOne(id, user);

    const perms = await this.usersService.getEffectivePermissions(user.id, task.project.id);
    if (!perms.includes('DELETE_TASK')) throw new ForbiddenException('Insufficient permissions');
    await this.auditLogService.log(user, 'DELETE', 'TASK', task.id, `Task "${task.title}" deleted`, task);
    return this.taskRepo.remove(task);
  }

  async checkOverdueTasks() {
    const now = new Date();
    const tasks = await this.taskRepo.find({ where: { isOverdue: false } });

    for (const task of tasks) {
      if (task.dueDate && task.dueDate < now) {
        task.isOverdue = true;
        await this.taskRepo.save(task);
      }
    }
  }
}