import { Controller, Get, Post, Body, Param, UseGuards, Delete, ParseIntPipe  } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/require-permission.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('CREATE_USER')
    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('VIEW_USERS')
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('DELETE_USER')
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('ASSIGN_ROLE')
    @Post(':id/roles/:roleId')
    assignRole(@Param('id', ParseIntPipe) userId: number, @Param('roleId') roleId: number) {
        return this.usersService.assignRole(userId, roleId);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('REMOVE_ROLE')
    @Delete(':id/roles/:roleId')
    removeRole(@Param('id', ParseIntPipe) userId: number, @Param('roleId') roleId: number) {
        return this.usersService.removeRole(userId, roleId);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@RequestUser() user: User) {
       return user;
    }
}