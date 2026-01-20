import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permission.decorator';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new ForbiddenException('Not authenticated');

    // Get projectId from route or body if exists
    const projectId = request.params.projectId || request.body.projectId || request.query.projectId;

    const userPermissions = await this.usersService.getEffectivePermissions(user.id, projectId);

    const normalized = userPermissions.map(p => p.toUpperCase());

    const hasAll = required.every(p =>
      normalized.includes(p.toUpperCase())
    );
    if (!hasAll) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}

// @Injectable()
// export class PermissionsGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private usersService: UsersService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const required = this.reflector.getAllAndOverride<string[]>(
//       PERMISSIONS_KEY,
//       [
//         context.getHandler(),
//         context.getClass(),
//       ],
//     );

//     if (!required || required.length === 0) return true;

//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     if (!user) throw new ForbiddenException('Not authenticated');

//     const userPermissions = await this.usersService.getUserPermissions(user.id);

//     const hasAll = required.every(p => userPermissions.includes(p));

//     if (!hasAll) {
//       throw new ForbiddenException('Insufficient permissions');
//     }

//     return true;
//   }
// }
