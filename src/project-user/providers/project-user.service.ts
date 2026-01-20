import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectUser } from '../project-user.entity';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/projects.entity';
import { User } from 'src/users/users.entity';
import { Role } from 'src/roles/roles.entuty';
import { AuditLogService } from 'src/audit-logs/providers/audit-logs.service';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private puRepo: Repository<ProjectUser>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    private auditLogService: AuditLogService
  ) {}

  async addUserToProject(userId: number, projectId: number, roleId: number, admin: User) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const project = await this.projectRepo.findOneBy({ id: projectId });
    const role = await this.roleRepo.findOneBy({ id: roleId });

    if (!user || !project || !role)
      throw new NotFoundException('User, Project or Role not found');

    if (role.scope !== 'PROJECT') {
      throw new BadRequestException('Role must be project-scoped for ProjectUser');
    }

    const exists = await this.puRepo.findOne({
      where: { user: { id: userId }, project: { id: projectId } },
    });

    if (exists)
      throw new BadRequestException('User already in project');

    const pu = this.puRepo.create({ user, project, role });
    await this.auditLogService.log(
      admin,
      'ADD_USER',
      'PROJECT',
      project.id,
      `User ${user.id} added with role ${role.name}`
    );
    return this.puRepo.save(pu);
  }

  async changeUserRole(userId: number, projectId: number, roleId: number, admin: User) {
    const pu = await this.puRepo.findOne({
      where: { user: { id: userId }, project: { id: projectId } },
    });
    const role = await this.roleRepo.findOneBy({ id: roleId });

    if (!pu || !role) throw new NotFoundException('User or Role not found');

    if (role.scope !== 'PROJECT') {
      throw new BadRequestException('Role must be project-scoped');
    }

    pu.role = role;
    await this.auditLogService.log(
      admin,
      'CHANGE_ROLE',
      'PROJECT',
      projectId,
      `User ${userId} role changed to ${role.name}`
    );

    return this.puRepo.save(pu);
  }

  async removeUserFromProject(userId: number, projectId: number, admin: User) {
    const pu = await this.puRepo.findOne({
      where: { user: { id: userId }, project: { id: projectId } },
    });
    if (!pu) throw new NotFoundException('User not in project');
    await this.auditLogService.log(
      admin,
      'REMOVE_USER',
      'PROJECT',
      projectId,
      `User ${userId} removed from project`
    );
    return this.puRepo.remove(pu);
  }
  async getProjectUsers(projectId: number) {
    return this.puRepo.find({
      where: { project: { id: projectId } },
      relations: ['user', 'role'],
    });
  }
}
