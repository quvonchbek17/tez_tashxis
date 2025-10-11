import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

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

    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.UNAUTHORIZED);
    }

    if (!user.role) {
      throw new HttpException('Ruxsat yo\'q', HttpStatus.FORBIDDEN);
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new HttpException('Bu API uchun ruxsat yo\'q', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
