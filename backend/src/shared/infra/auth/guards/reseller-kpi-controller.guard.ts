import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable
} from '@nestjs/common'
import {
  CaslAbilityFactory,
  AppAbility
} from '@/shared/infra/auth/casl/casl-ability.factory'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'

@Injectable()
export class ResellerKpiControllerGuard implements CanActivate {
  constructor(
    @Inject('CaslAbilityFactory')
    private readonly abilityFactory: CaslAbilityFactory
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user: UserPayload = request.user

    if (!user) {
      throw new ForbiddenException('Access denied')
    }

    const ability: AppAbility = this.abilityFactory.createForUser({
      id: user.id,
      role: user.role
    })

    if (!ability.can(Actions.Create, 'reseller-kpi')) {
      throw new ForbiddenException(
        'You do not have permission to access this resource'
      )
    }

    return true
  }
}
