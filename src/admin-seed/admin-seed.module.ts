import { Module } from '@nestjs/common';
import { AdminSeederService } from './providers/admin-seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Role } from 'src/roles/roles.entuty';
import { Permission } from 'src/permissions/permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  providers: [AdminSeederService],
  exports: [AdminSeederService]
})
export class AdminSeedModule {}
