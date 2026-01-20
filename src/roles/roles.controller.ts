import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './providers/roles.service';
import { CreateRoleDto } from './dtos/role.create.dto';
import { RequirePermissions } from 'src/auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.rolesService.create(dto);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('ASSIGN_ROLE')
    @Post(':id/permissions/:permId')
    assignPermission(
        @Param('id') id: number,
        @Param('permId') permId: number,
    ) {
        return this.rolesService.assignPermission(+id, +permId);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('REMOVE_PERMISSION')
    @Delete(':id/permissions/:permId')
    removePermission(@Param('id') id, @Param('permId') permId) {
    return this.rolesService.removePermission(+id, +permId);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('VIEW_ROLES')
    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('DELETE_ROLE')
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.rolesService.remove(id);
    }
}