import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { PermissionsGuard } from './guards/permission.guard';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Role } from 'src/roles/roles.entuty';
import { Permission } from 'src/permissions/permissions.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule, 
    RolesModule,
    PermissionsModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
    JwtModule.register({
      secret: 'mySecret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PermissionsGuard, JwtAuthGuard],
  exports: [AuthService]
})
export class AuthModule {}
