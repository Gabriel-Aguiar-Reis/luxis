import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CaslRuleBuilder } from '@/shared/infra/auth/casl/interfaces/casl-rules.builder'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { AbilityBuilder } from '@casl/ability'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SaleCaslRule implements CaslRuleBuilder {
  buildFor(user: UserPayload, builder: AbilityBuilder<AppAbility>) {
    const { can } = builder

    switch (user.role) {
      case Role.ADMIN:
        can(Actions.Manage, Sale)
        break
      case Role.RESELLER:
        can(Actions.Read, Sale, { resellerId: user.id })
        can(Actions.Update, Sale, { resellerId: user.id })
        can(Actions.Delete, Sale, { resellerId: user.id })
        can(Actions.Create, Sale)
        break
      case Role.ASSISTANT:
        can(Actions.Read, Sale)
    }
  }
}
