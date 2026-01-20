import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './providers/boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module';
import { Board } from './boards.entity';
import { Project } from 'src/projects/projects.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
  imports: [
      TypeOrmModule.forFeature([ Board, Project]),
      AuditLogsModule, UsersModule
    ],
    exports: [BoardsService]
})
export class BoardsModule {}
