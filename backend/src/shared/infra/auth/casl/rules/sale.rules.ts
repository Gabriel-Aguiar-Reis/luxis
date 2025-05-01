import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { CaslRuleBuilder } from '@/shared/infra/auth/casl/interfaces/casl-rules.builder'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { AbilityBuilder } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class SaleCaslRule implements CaslRuleBuilder {
  buildFor(user: { id: UUID; role: Role }, builder: AbilityBuilder<any>) {
    const { can } = builder

    if (user.role === Role.ADMIN) {
      can(Actions.Manage, Sale)
    } else if (user.role === Role.RESELLER) {
      can(Actions.Read, Sale, { resellerId: user.id })
      can(Actions.Update, Sale, { resellerId: user.id })
      can(Actions.Delete, Sale, { resellerId: user.id })
      can(Actions.Create, Sale)
    }
  }
}
