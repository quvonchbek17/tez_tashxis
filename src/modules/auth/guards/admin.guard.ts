import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new HttpException("Token mavjud emas", HttpStatus.UNAUTHORIZED);
    }
    try {
      const payload = await this.authService.verify(token);
      const userId = payload.id;
      let user = await this.authService.validateAdmin(userId);
      if (!user) {
        throw new HttpException("Admin topilmadi", HttpStatus.FORBIDDEN);
      }
      request.user = user;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.FORBIDDEN);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
