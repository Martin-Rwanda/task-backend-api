import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from '../audit-logs.entity';
import { User } from 'src/users/users.entity';
import { Task } from 'src/tasks/tasks.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async log(
    performedBy: User, 
    action: string, 
    entityType?: string, 
    entityId?: number, 
    description?: string,
    task?: Task
  ) {
    const log = this.auditRepo.create({ performedBy, action, entityType, entityId, description, task });
    return this.auditRepo.save(log);
  }

  async findAll() {
    return this.auditRepo.find({ relations: ['performedBy', 'task'] });
  }
}