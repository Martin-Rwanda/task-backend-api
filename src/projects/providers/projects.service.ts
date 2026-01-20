import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../projects.entity';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { User } from 'src/users/users.entity';
import { AuditLogService } from 'src/audit-logs/providers/audit-logs.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly auditLogService: AuditLogService
  ) {}

  async create(dto: CreateProjectDto, user: User) {
    const project = this.projectRepo.create({ ...dto, createdBy: user });
    const savedProject = await this.projectRepo.save(project);

    await this.auditLogService.log(
      user,
      'CREATE',
      'PROJECT',
      savedProject.id,
      `Project "${savedProject.name}" created`
    );

    return savedProject;
  }

  async findAll() {
    return this.projectRepo.find({ relations: ['createdBy', 'boards', 'projectUsers'] });
  }

  async findOne(id: number) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['createdBy', 'boards', 'projectUsers'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: number, dto: UpdateProjectDto, user: User) {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    Object.assign(project, dto);
    const updatedProject = await this.projectRepo.save(project);

    await this.auditLogService.log(
      user,
      'UPDATE',
      'PROJECT',
      project.id,
      `Project "${project.name}" updated`
    );

    return updatedProject;
  }

  async remove(id: number, user: User) {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    await this.auditLogService.log(
      user,
      'DELETE',
      'PROJECT',
      project.id,
      `Project "${project.name}" deleted`
    );

    return this.projectRepo.remove(project);
  }
}