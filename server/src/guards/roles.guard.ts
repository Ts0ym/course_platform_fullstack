import {Injectable, CanActivate, ExecutionContext, SetMetadata} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        try{
            const request = context.switchToHttp().getRequest();
            const token = request.headers.authorization.split(' ')[1];
            const decoded = this.jwtService.decode(token);
            const userRoles = decoded.role;
            return requiredRoles.some((role) => userRoles.includes(role));
        }catch (e) {
            return false
        }
    }
}