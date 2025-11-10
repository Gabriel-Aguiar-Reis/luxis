import { PasswordResetRequest } from '@/modules/auth/domain/entities/password-reset-request.entity'
import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { IPolicy } from '@/shared/infra/auth/interfaces/policy-handler.interface'

export class ReadPasswordResetRequestPolicy implements IPolicy {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Read, PasswordResetRequest)
  }
}
