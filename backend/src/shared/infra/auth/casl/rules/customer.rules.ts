import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { CaslRuleBuilder } from '@/shared/infra/auth/casl/interfaces/casl-rules.builder'
import { AbilityBuilder } from '@casl/ability'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CustomerCaslRule implements CaslRuleBuilder {
  constructor() {}

  buildFor(user: UserPayload, builder: AbilityBuilder<AppAbility>) {
    const { can } = builder

    switch (user.role) {
      case Role.ADMIN:
        can(Actions.Manage, Customer)
        break
      case Role.RESELLER:
        can(Actions.Create, Customer)
        can(Actions.Update, Customer)
        can(Actions.Read, Customer)
        break
      case Role.ASSISTANT:
        can(Actions.Read, Customer)
        break
    }
  }
}
