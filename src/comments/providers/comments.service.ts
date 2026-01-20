import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comments.entity';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { UpdateCommentDto } from '../dtos/update-comment.dto';
import { Task } from 'src/tasks/tasks.entity';
import { User } from 'src/users/users.entity';
import { AuditLogService } from 'src/audit-logs/providers/audit-logs.service';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    private auditLogService: AuditLogService,
    private usersService: UsersService,
  ) {}

  async create(dto: CreateCommentDto, user: User) {
    const task = await this.taskRepo.findOne({ where: { id: dto.taskId }, relations: ['project'] });
    if (!task) throw new NotFoundException('Task not found');

    // Permission check
    const perms = await this.usersService.getEffectivePermissions(user.id, task.project.id);
    if (!perms.includes('COMMENT_ON_TASK')) throw new ForbiddenException('Insufficient permissions');

    const comment = this.commentRepo.create({
      message: dto.message,
      task,
      createdBy: user,
    });

    const saved = await this.commentRepo.save(comment);

    await this.auditLogService.log(
      user,
      'CREATE',
      'COMMENT',
      saved.id,
      `Comment created on task ${task.id}`,
      task
    );

    return saved;
  }

  async update(id: number, dto: UpdateCommentDto, user: User) {
    const comment = await this.commentRepo.findOne({ where: { id }, relations: ['task', 'task.project'] });
    if (!comment) throw new NotFoundException('Comment not found');

    const perms = await this.usersService.getEffectivePermissions(user.id, comment.task.project.id);
    if (!perms.includes('COMMENT_ON_TASK')) throw new ForbiddenException('Insufficient permissions');

    Object.assign(comment, dto);
    const saved = await this.commentRepo.save(comment);

    await this.auditLogService.log(
      user,
      'UPDATE',
      'COMMENT',
      saved.id,
      `Comment updated on task ${comment.task.id}`,
      comment.task
    );

    return saved;
  }

  async remove(id: number, user: User) {
    const comment = await this.commentRepo.findOne({ where: { id }, relations: ['task', 'task.project'] });
    if (!comment) throw new NotFoundException('Comment not found');

    const perms = await this.usersService.getEffectivePermissions(user.id, comment.task.project.id);
    if (!perms.includes('DELETE_COMMENT')) throw new ForbiddenException('Insufficient permissions');

    await this.auditLogService.log(
      user,
      'DELETE',
      'COMMENT',
      comment.id,
      `Comment deleted from task ${comment.task.id}`,
      comment.task
    );

    return this.commentRepo.remove(comment);
  }

  async findAllByTask(taskId: number, user: User) {
    const task = await this.taskRepo.findOne({ where: { id: taskId }, relations: ['project'] });
    if (!task) throw new NotFoundException('Task not found');

    const perms = await this.usersService.getEffectivePermissions(user.id, task.project.id);
    if (!perms.includes('VIEW_TASK')) throw new ForbiddenException('Insufficient permissions');

    return this.commentRepo.find({ where: { task: { id: taskId } }, relations: ['createdBy'] });
  }
}