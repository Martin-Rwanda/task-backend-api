import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditLogService } from './providers/audit-logs.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/require-permission.decorator';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditService: AuditLogService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('VIEW_AUDIT_LOGS')
  @Get()
  async findAll() {
    return this.auditService.findAll();
  }
}