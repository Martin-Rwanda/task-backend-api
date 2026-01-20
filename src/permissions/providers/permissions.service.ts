import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../permissions.entity';
import { CreatePermissionDto } from '../dtos/permission-create.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permRepo: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    let permExist = await this.permRepo.findOne({
      where: {
          name: createPermissionDto.name
      }
    })
    if (permExist){
      throw new ConflictException('Permission already exists');
    }
    return this.permRepo.save(createPermissionDto);
  }

  async findAll() {
    return await this.permRepo.find();
  }
}