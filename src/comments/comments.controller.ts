import { Controller, Post, Put, Delete, Get, Param, Body, UseGuards } from '@nestjs/common';
import { CommentsService } from './providers/comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/require-permission.decorator';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { User } from 'src/users/users.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('COMMENT_ON_TASK')
  @Post()
  create(@Body() dto: CreateCommentDto, @RequestUser() user: User) {
    return this.commentsService.create(dto, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('COMMENT_ON_TASK')
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCommentDto, @RequestUser() user: User) {
    return this.commentsService.update(id, dto, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('DELETE_COMMENT')
  @Delete(':id')
  remove(@Param('id') id: number, @RequestUser() user: User) {
    return this.commentsService.remove(id, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('VIEW_TASK')
  @Get('task/:taskId')
  findAllByTask(@Param('taskId') taskId: number, @RequestUser() user: User) {
    return this.commentsService.findAllByTask(taskId, user);
  }
}