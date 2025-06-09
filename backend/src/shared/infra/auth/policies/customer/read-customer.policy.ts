import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { IPolicy } from '@/shared/infra/auth/interfaces/policy-handler.interface'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { Injectable } from '@nestjs/common'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'

@Injectable()
export class ReadCustomerPolicy implements IPolicy {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Read, Customer)
  }
}
