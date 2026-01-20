import { Controller, Post, Delete, Patch, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ProjectUserService } from './providers/project-user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/require-permission.decorator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { User } from 'src/users/users.entity';

class ProjectUserDto {
  userId: number;
  projectId: number;
  roleId: number;
}

@Controller('project-users')
export class ProjectUserController {
    constructor(private readonly puService: ProjectUserService) {}

    @Post()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('MANAGE_PROJECT_USERS')
    async addUser(@Body() dto: ProjectUserDto, @RequestUser() admin: User) {
    return this.puService.addUserToProject(dto.userId, dto.projectId, dto.roleId, admin);
    }

    @Patch()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('MANAGE_PROJECT_USERS')
    async changeRole(@Body() dto: ProjectUserDto, @RequestUser() admin: User) {
    return this.puService.changeUserRole(dto.userId, dto.projectId, dto.roleId, admin);
    }

    @Delete(':projectId/user/:userId')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('MANAGE_PROJECT_USERS')
    async removeUser(
    @Param('userId') userId: number,
    @Param('projectId') projectId: number,
    @RequestUser() admin: User
    ) {
    return this.puService.removeUserFromProject(userId, projectId, admin);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('VIEW_PROJECT_USERS')
    @Get(':projectId')
    async listUsers(@Param('projectId') projectId: number) {
        return this.puService.getProjectUsers(projectId);
    }
}