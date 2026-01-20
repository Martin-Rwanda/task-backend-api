import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../roles.entuty';
import { Repository } from 'typeorm';
import { Permission } from 'src/permissions/permissions.entity';
import { CreateRoleDto } from '../dtos/role.create.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permRepo: Repository<Permission>,
  ) {}

  async create(dto: CreateRoleDto) {
      const role = this.roleRepo.create(dto);
      return this.roleRepo.save(role);
  }

  async assignPermission(roleId: number, permId: number) {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role){
        throw new NotFoundException('Role Not Found')
    }
    const perm = await this.permRepo.findOneBy({ id: permId });
    if(!perm){
        throw new NotFoundException('Permission Not Found')
    }
    if (role.permissions.some(p => p.id === perm.id)) {
        throw new BadRequestException('Permission already assigned to role');
    }
    role.permissions = role.permissions || [];
    role.permissions.push(perm);

    return this.roleRepo.save(role);
  }

  async removePermission(roleId: number, permId: number) {
    const role = await this.roleRepo.findOne({
        where: { id: roleId },
        relations: ['permissions'],
    });

    if (!role){
        throw new NotFoundException('Role Not Found')
    }
    const originalLength = role.permissions.length;
    role.permissions = role.permissions.filter(p => p.id !== permId);

    if (role.permissions.length === originalLength) {
      throw new NotFoundException('Permission not assigned to role');
    }

    return this.roleRepo.save(role);
  }

  async findAll() {
    return this.roleRepo.find({ relations: ['permissions'] });
  }

  async remove(id: number) {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException('Role not found');

    role.isActive = false;
    return this.roleRepo.save(role);
  }
}