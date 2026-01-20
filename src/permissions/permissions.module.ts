import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './providers/permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permissions.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports:[PermissionsService],
  imports: [TypeOrmModule.forFeature([Permission]), UsersModule]
})
export class PermissionsModule {}
