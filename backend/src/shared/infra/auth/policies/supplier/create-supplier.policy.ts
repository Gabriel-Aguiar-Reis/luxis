import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { IPolicy } from '@/shared/infra/auth/interfaces/policy-handler.interface'
import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateSupplierPolicy implements IPolicy {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Create, Supplier)
  }
}
