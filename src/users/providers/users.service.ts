import { ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Role } from 'src/roles/roles.entuty';
import { Permission } from 'src/permissions/permissions.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Role)
        private roleRepo: Repository<Role>,
        @InjectRepository(Permission)
        private permRepo: Repository<Permission>,
    ){}

    async create(createUserDto: CreateUserDto) {
        const exist = await this.userRepo.findOne({
            where: { email: createUserDto.email },
        });

        if (exist) {
            throw new ConflictException('User already exists');
        }

        const user = this.userRepo.create(createUserDto);

        user.password = await bcrypt.hash(user.password, 10);

        return this.userRepo.save(user);
    }

    async assignRole(userId: number, roleId: number) {
        const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['roles'],
        });

        if(!user) {
            throw new NotFoundException('User not Found')
        }
        const role = await this.roleRepo.findOneBy({ id: roleId });

        if(!role) {
            throw new NotFoundException('Role not Found')
        }
        user.roles.push(role);

        return this.userRepo.save(user);
    }

    async getEffectivePermissions(userId: number, projectId?: number): Promise<string[]> {
        const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: [
            'roles',
            'roles.permissions',
            'projectUsers',
            'projectUsers.role',
            'projectUsers.role.permissions',
        ],
        });

        if (!user) throw new NotFoundException('User not found');

        const globalPerms = user.roles
        .filter(r => r.scope === 'GLOBAL')
        .flatMap(r => r.permissions.map(p => p.name));

        let projectPerms: string[] = [];
        if (projectId) {
        const pu = user.projectUsers.find(pu => pu.project.id === projectId);
        if (pu && pu.role.scope === 'PROJECT') {
            projectPerms = pu.role.permissions.map(p => p.name);
        }
        }

        return [...new Set([...globalPerms, ...projectPerms])];
    }

    async findAll(){
        return await this.userRepo.find()
    }

    async remove(id: number) {
        return await this.userRepo.delete(id)
    }

    async removeRole(userId: number, roleId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['roles'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const originalLength = user.roles.length;
        user.roles = user.roles.filter(r => r.id !== roleId);

        if (user.roles.length === originalLength) {
            throw new NotFoundException('Role not assigned to user');
        }

        return this.userRepo.save(user);
    }
}
