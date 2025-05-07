import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { IPolicyHandler } from '@/shared/infra/auth/interfaces/policy-handler.interface'
import { Return } from '@/modules/return/domain/entities/return.entity'

export class UpdateReturnPolicy implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Update, Return)
  }
}
