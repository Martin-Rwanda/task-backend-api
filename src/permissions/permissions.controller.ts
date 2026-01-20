import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PermissionsService } from './providers/permissions.service';
import { CreatePermissionDto } from './dtos/permission-create.dto';
import { RequirePermissions } from 'src/auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';

@Controller('permissions')
export class PermissionsController {
    constructor(
        private readonly service: PermissionsService
    ) {}

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('CREATE_PERMISSION')
    @Post()
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.service.create(createPermissionDto);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('VIEW_PERMISSIONS')
    @Get()
    findAll() {
        return this.service.findAll();
    }
}