import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from '../users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  @Inject()
  private readonly uersService: UsersService;

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const users = await this.uersService.findOne(user.sub);
    const roles = users.roles;
    const roleNames = roles.map((role) => role.name);
    console.log(user.sub, users, roleNames);

    if (!requiredRoles.some((role) => roleNames?.includes(role))) {
      throw new ForbiddenException('用户角色权限不足');
    }

    return true;
  }
}
