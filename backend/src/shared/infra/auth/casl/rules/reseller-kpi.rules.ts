import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CaslRuleBuilder } from '@/shared/infra/auth/casl/interfaces/casl-rules.builder'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { AbilityBuilder } from '@casl/ability'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ResellerKpiCaslRule implements CaslRuleBuilder {
  buildFor(user: UserPayload, builder: AbilityBuilder<AppAbility>) {
    const { can } = builder

    switch (user.role) {
      case Role.RESELLER:
        can(Actions.Create, 'reseller-kpi')
        can(Actions.Read, 'reseller-kpi')
        break
      case Role.ADMIN:
        // Admin também pode acessar KPIs de reseller se necessário
        can(Actions.Manage, 'reseller-kpi')
        break
    }
  }
}
