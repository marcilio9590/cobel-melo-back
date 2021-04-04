import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PROFILE_TYPE_KEY } from '../decorators/profiles.decorator';
import { ProfileTypes } from '../enums/profiles.enum';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(private reflector: Reflector,
    private authService: AuthService) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredProfiles = this.reflector.getAllAndOverride<ProfileTypes[]>(PROFILE_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredProfiles) {
      return true;
    }

    const token = context.switchToHttp().getRequest().headers['authorization'];
    if (!token) {
      return false;
    }
    const decoded = this.authService.decode(token ? token.split('Bearer ')[1] : '');
    return requiredProfiles.includes(decoded['profileType']);
  }
}