import { Controller, Get, Post, Body, Param, UseGuards, Delete, Put, Patch } from '@nestjs/common';
import { TasksService } from './providers/tasks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/require-permission.decorator';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dtos';
import { AuditLogService } from 'src/audit-logs/providers/audit-logs.service';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { User } from 'src/users/users.entity';

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
        private readonly auditLogService: AuditLogService,
    ) {}

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('CREATE_TASK')
    @Post()
    async create(@Body() dto: CreateTaskDto, @RequestUser() user: User) {
        const task = await this.tasksService.create(dto, user);

        await this.auditLogService.log(
        user,
        'CREATE',
        'TASK',
        task.id,
        `Task "${task.title}" created`
        );

        return task;
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('VIEW_TASKS')
    async findAll(@RequestUser() user: User) {
        return this.tasksService.findAll(user);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('VIEW_TASK')
    async findOne(@Param('id') id: number, @RequestUser() user: User) {
        return this.tasksService.findOne(id, user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('UPDATE_TASK')
    async update(
    @Param('id') id: number,
    @Body() dto: UpdateTaskDto,
    @RequestUser() user: User
    ) {
        return this.tasksService.update(id, dto, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('DELETE_TASK')
    async remove(@Param('id') id: number, @RequestUser() user: User) {
        return this.tasksService.remove(id, user);
    }


    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('VIEW_OVERDUE_TASKS')
    @Get('overdue')
    getOverdue() {
        return this.tasksService.checkOverdueTasks();
    }
}