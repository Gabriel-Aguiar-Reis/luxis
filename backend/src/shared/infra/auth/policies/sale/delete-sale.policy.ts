import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { IPolicyHandler } from '@/shared/infra/auth/interfaces/policy-handler.interface'

export class DeleteSalePolicy implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Delete, Sale)
  }
}
