import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/permissions.entity';
import { Role } from 'src/roles/roles.entuty';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AdminSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
  ) {}

  async onModuleInit() {
    await this.seedPermissions();
    await this.seedAdminRole();
    await this.seedAdminUser();
  }

  private async seedPermissions() {
    const perms = [
      'CREATE_USER','DELETE_USER','VIEW_USERS','ASSIGN_ROLE','REMOVE_ROLE','ASSIGN_PERMISSION','REMOVE_PERMISSION',
      'CREATE_ROLE','DELETE_ROLE','VIEW_ROLES',
      'CREATE_PERMISSION','DELETE_PERMISSION','VIEW_PERMISSIONS',
      'CREATE_PROJECT','VIEW_PROJECT','UPDATE_PROJECT','DELETE_PROJECT','ASSIGN_PROJECT_ROLE',
      'CREATE_BOARD','VIEW_BOARD','UPDATE_BOARD','DELETE_BOARD',
      'CREATE_TASK','VIEW_TASK','UPDATE_TASK','DELETE_TASK','SET_TASK_DEADLINE','VIEW_OVERDUE_TASKS',
      'ASSIGN_TASK','REMOVE_TASK_ASSIGNMENT','VIEW_TASK_ASSIGNMENTS',
      'UPDATE_STATUS','COMPLETE_TASK',
      'COMMENT_ON_TASK','DELETE_COMMENT',
    ];

    for (const name of perms) {
      const exists = await this.permRepo.findOne({ where: { name } });
      if (!exists) await this.permRepo.save({ name, description: `${name} permission` });
    }
  }

  private async seedAdminRole() {
    let role = await this.roleRepo.findOne({ where: { name: 'ADMIN' }, relations: ['permissions'] });
    if (!role) role = await this.roleRepo.save({ name: 'ADMIN', permissions: [] });

    const allPerms = await this.permRepo.find();
    role.permissions = allPerms;
    role.scope = 'GLOBAL';
    await this.roleRepo.save(role);
  }

  private async seedAdminUser() {
    let user = await this.userRepo.findOne({ where: { email: 'admin@example.com' }, relations: ['roles'] });
    if (!user) {
      user = await this.userRepo.save({
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('Admin123!', 10),
        isActive: true,
        roles: [],
      });
    }

    const adminRole = await this.roleRepo.findOneBy({ name: 'ADMIN' });
    if (!adminRole) throw new NotFoundException('Admin role not found');
    user.roles = [adminRole];
    await this.userRepo.save(user);
  }
}