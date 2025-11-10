import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { IPolicy } from '@/shared/infra/auth/interfaces/policy-handler.interface'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { Injectable } from '@nestjs/common'
import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'

@Injectable()
export class ReadInventoryPolicy implements IPolicy {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Read, Inventory)
  }
}
