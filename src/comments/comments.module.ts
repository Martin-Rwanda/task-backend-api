import { Module } from '@nestjs/common';
import { CommentsService } from './providers/comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module';
import { Task } from 'src/tasks/tasks.entity';
import { Comment } from './comments.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [
      TypeOrmModule.forFeature([Comment, Task]),
      AuditLogsModule,
      UsersModule
    ],
})
export class CommentsModule {}
