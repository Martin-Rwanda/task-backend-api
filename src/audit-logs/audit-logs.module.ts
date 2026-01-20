import { Module } from '@nestjs/common';
import { AuditLogService } from './providers/audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit-logs.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog]), UsersModule],
  providers: [AuditLogService],
  controllers: [AuditLogsController],
  exports: [AuditLogService]
})
export class AuditLogsModule {}
