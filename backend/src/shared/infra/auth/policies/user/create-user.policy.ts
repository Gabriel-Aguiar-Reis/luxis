import { User } from '@/modules/user/domain/entities/user.entity'
import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { IPolicyHandler } from '@/shared/infra/auth/interfaces/policy-handler.interface'

export class CreateUserPolicy implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Create, User)
  }
}
