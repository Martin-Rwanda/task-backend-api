import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from '../boards.entity';
import { CreateBoardDto } from '../dtos/create-boards.dto';
import { UpdateBoardDto } from '../dtos/update-boards.dto';
import { Project } from 'src/projects/projects.entity';
import { UsersService } from 'src/users/providers/users.service';
import { AuditLogService } from 'src/audit-logs/providers/audit-logs.service';
import { User } from 'src/users/users.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepo: Repository<Board>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    private readonly usersService: UsersService,
    private readonly auditLogService: AuditLogService,
  ) {}
  async create(dto: CreateBoardDto, user: User) {
    const project = await this.projectRepo.findOne({ where: { id: dto.projectId } });
    if (!project) throw new NotFoundException('Project not found');

    // ✅ Permission check
    const perms = await this.usersService.getEffectivePermissions(user.id, project.id);
    if (!perms.includes('CREATE_BOARD')) throw new ForbiddenException('You do not have permission to create board in this project');

    const board = this.boardRepo.create({ name: dto.name, project });
    const savedBoard = await this.boardRepo.save(board);

    // ✅ Audit log
    await this.auditLogService.log(
      user,
      'CREATE',
      'BOARD',
      savedBoard.id,
      `Board "${savedBoard.name}" created`
    );

    return savedBoard;
  }
  async findAll() {
    return this.boardRepo.find({ relations: ['project', 'tasks'] });
  }

  async findOne(id: number) {
    const board = await this.boardRepo.findOne({ where: { id }, relations: ['project', 'tasks'] });
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }
  async update(id: number, dto: UpdateBoardDto, user: User) {
    const board = await this.boardRepo.findOne({ where: { id }, relations: ['project'] });
    if (!board) throw new NotFoundException('Board not found');

    const perms = await this.usersService.getEffectivePermissions(user.id, board.project.id);
    if (!perms.includes('UPDATE_BOARD')) throw new ForbiddenException('You do not have permission to update board in this project');

    Object.assign(board, dto);
    const updatedBoard = await this.boardRepo.save(board);

    await this.auditLogService.log(
      user,
      'UPDATE',
      'BOARD',
      board.id,
      `Board "${board.name}" updated`
    );
    return updatedBoard;
  }
  async remove(id: number, user: User) {
    const board = await this.boardRepo.findOne({ where: { id }, relations: ['project'] });
    if (!board) throw new NotFoundException('Board not found');

    const perms = await this.usersService.getEffectivePermissions(user.id, board.project.id);
    if (!perms.includes('DELETE_BOARD')) throw new ForbiddenException('Insufficient permissions');

    await this.auditLogService.log(
      user,
      'DELETE',
      'BOARD',
      board.id,
      `Board "${board.name}" deleted`
    );

    return this.boardRepo.remove(board);
  }
}