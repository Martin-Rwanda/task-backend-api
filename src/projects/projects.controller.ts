import { Controller, Get, Post, Body, Param, UseGuards, Delete, Put } from '@nestjs/common';
import { ProjectsService } from './providers/projects.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/require-permission.decorator';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { User } from 'src/users/users.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('CREATE_PROJECT')
  create(@Body() dto: CreateProjectDto, @RequestUser() user: User) {
    return this.projectsService.create(dto, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('VIEW_PROJECT')
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('VIEW_PROJECT')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.projectsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('UPDATE_PROJECT')
  update(@Param('id') id: number, @Body() dto: UpdateProjectDto, @RequestUser() user: User) {
    return this.projectsService.update(id, dto, user);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('DELETE_PROJECT')
  remove(@Param('id') id: number, @RequestUser() user: User) {
    return this.projectsService.remove(id, user);
  }
}
