import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { IPolicy } from '@/shared/infra/auth/interfaces/policy-handler.interface'
import { Return } from '@/modules/return/domain/entities/return.entity'

export class ReadReturnPolicy implements IPolicy {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Read, Return)
  }
}
