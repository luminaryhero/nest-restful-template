import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users.service';
import { PERMS_KEY } from './perms.decorator';

@Injectable()
export class PermsGuard implements CanActivate {
  @Inject()
  private readonly uersService: UsersService;

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPerms = this.reflector.getAllAndOverride<string[]>(
      PERMS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPerms) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    // 管理员角色默认拥有所有权限
    const { roles } = await this.uersService.findOne(user.sub);
    if (roles.some((role) => role.name === 'admin')) {
      return true;
    }

    // 用户权限
    const permNames = await this.uersService.findPermsById(user.sub);

    if (!requiredPerms.some((role) => permNames?.includes(role))) {
      throw new ForbiddenException('用户权限不足');
    }

    return true;
  }
}
