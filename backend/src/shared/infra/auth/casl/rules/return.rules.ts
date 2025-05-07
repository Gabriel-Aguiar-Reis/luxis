import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CaslRuleBuilder } from '@/shared/infra/auth/casl/interfaces/casl-rules.builder'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { AbilityBuilder } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { Return } from '@/modules/return/domain/entities/return.entity'
@Injectable()
export class ReturnCaslRule implements CaslRuleBuilder {
  buildFor(user: UserPayload, builder: AbilityBuilder<AppAbility>) {
    const { can } = builder

    switch (user.role) {
      case Role.ADMIN:
        can(Actions.Manage, Return)
        break
      case Role.RESELLER:
        can(Actions.Read, Return, { resellerId: user.id })
        can(Actions.Create, Return, { resellerId: user.id })
        break
      case Role.ASSISTANT:
        can(Actions.Read, Return)
        break
    }
  }
}
