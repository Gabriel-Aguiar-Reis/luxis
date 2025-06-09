import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { IPolicy } from '@/shared/infra/auth/interfaces/policy-handler.interface'
import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateOwnershipTransferPolicy implements IPolicy {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Create, OwnershipTransfer)
  }
}
