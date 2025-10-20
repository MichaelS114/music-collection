// src/auth/admin.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isAdmin = request.headers['x-admin'];

    if (isAdmin === 'true' || isAdmin === true) {
      return true;
    }
    throw new ForbiddenException('Admin access only');
  }
}
