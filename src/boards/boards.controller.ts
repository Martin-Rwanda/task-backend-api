import { Controller, Get, Post, Body, Param, UseGuards, Delete, Put } from '@nestjs/common';
import { BoardsService } from './providers/boards.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/require-permission.decorator';
import { CreateBoardDto } from './dtos/create-boards.dto';
import { UpdateBoardDto } from './dtos/update-boards.dto';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { User } from 'src/users/users.entity';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('CREATE_BOARD')
  @Post()
  create(@Body() dto: CreateBoardDto, @RequestUser() user: User) {
    return this.boardsService.create(dto, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('VIEW_BOARD')
  @Get()
  findAll() {
    return this.boardsService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('VIEW_BOARD')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.boardsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('UPDATE_BOARD')
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateBoardDto, @RequestUser() user: User) {
    return this.boardsService.update(id, dto, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('DELETE_BOARD')
  @Delete(':id')
  remove(@Param('id') id: number, @RequestUser() user: User) {
    return this.boardsService.remove(id, user);
  }
}