import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskAssignment } from 'src/task-assignments/task-assignments.entity';
import { Task } from 'src/tasks/tasks.entity';
import { User } from 'src/users/users.entity';
import { AssignTaskDto, TaskAssignmentRole } from '../dtos/assign-task.dtos';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class TaskAssignmentService {
  constructor(
    @InjectRepository(TaskAssignment)
    private repo: Repository<TaskAssignment>,

    @InjectRepository(Task)
    private taskRepo: Repository<Task>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private usersService: UsersService,
  ) {}

  async assign(dto: AssignTaskDto, assignedBy: User) {
    const task = await this.taskRepo.findOne({
      where: { id: dto.taskId },
      relations: ['project'],
    });
    if (!task) throw new NotFoundException('Task not found');

    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const perms = await this.usersService.getEffectivePermissions(
      assignedBy.id,
      task.project.id,
    );
    if (!perms.includes('ASSIGN_TASK'))
      throw new ForbiddenException('Insufficient permissions');

    const role = dto.role || TaskAssignmentRole.ASSIGNEE;
    const existing = await this.repo.findOne({
      where: { task: { id: task.id }, user: { id: user.id }, role },
    });
    if (existing)
      throw new BadRequestException(
        `User already assigned to this task as ${role}`,
      );

    const assignment = this.repo.create({
      task,
      user,
      role,
      assignedBy,
    });

    return this.repo.save(assignment);
  }

  async remove(id: number, user: User) {
    const assignment = await this.repo.findOne({
      where: { id },
      relations: ['task', 'task.project'],
    });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const perms = await this.usersService.getEffectivePermissions(
      user.id,
      assignment.task.project.id,
    );
    if (!perms.includes('REMOVE_TASK_ASSIGNMENT'))
      throw new ForbiddenException('Insufficient permissions');

    return this.repo.remove(assignment);
  }

  async getTaskAssignments(taskId: number, user: User) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['project'],
    });
    if (!task) throw new NotFoundException('Task not found');

    const perms = await this.usersService.getEffectivePermissions(
      user.id,
      task.project.id,
    );
    if (!perms.includes('VIEW_TASK_ASSIGNMENTS'))
      throw new ForbiddenException('Insufficient permissions');

    return this.repo.find({
      where: { task: { id: taskId } },
      relations: ['task', 'assignedBy', 'user'],
    });
  }
}