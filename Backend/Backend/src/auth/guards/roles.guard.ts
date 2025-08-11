import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../shared/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('No user role found');
    }
    const normalizedUserRole = String(user.role).toUpperCase();
    const normalizedRequiredRoles = requiredRoles.map(role => role.toUpperCase());

    const hasRole = normalizedRequiredRoles.includes(normalizedUserRole);


    if (!hasRole) {
      throw new ForbiddenException('Forbidden resource');
    }

    return true;
  }
}
