import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CHECK_POLICIES_KEY } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { IS_PUBLIC_KEY } from '@/shared/infra/auth/decorators/public.decorator'
import {
  IPolicy,
  PolicyCallback
} from '@/shared/infra/auth/interfaces/policy-handler.interface'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('CaslAbilityFactory')
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    const handlers =
      this.reflector.get<IPolicy[]>(CHECK_POLICIES_KEY, context.getHandler()) ||
      []

    const request = context.switchToHttp().getRequest()
    const user = request.user
    const ability = this.caslAbilityFactory.createForUser(user)

    return handlers.every((handler) => {
      return typeof handler === 'function'
        ? (handler as PolicyCallback)(ability)
        : handler.handle(ability)
    })
  }
}
