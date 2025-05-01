import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { ROLES_KEY } from '@/shared/infra/auth/decorators/roles.decorator'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requiredRoles) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user as UserPayload

    if (user.status === UserStatus.DISABLED) {
      throw new ForbiddenException('Disabled Account')
    }

    return requiredRoles.includes(user.role)
  }
}
