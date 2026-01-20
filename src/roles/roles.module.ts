import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './providers/roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.entuty';
import { Permission } from 'src/permissions/permissions.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]),
    UsersModule
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
