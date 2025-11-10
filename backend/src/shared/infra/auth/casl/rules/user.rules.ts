import { User } from '@/modules/user/domain/entities/user.entity'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CaslRuleBuilder } from '@/shared/infra/auth/casl/interfaces/casl-rules.builder'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { AbilityBuilder } from '@casl/ability'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserCaslRule implements CaslRuleBuilder {
  buildFor(user: UserPayload, builder: AbilityBuilder<AppAbility>) {
    const { can } = builder

    switch (user.role) {
      case Role.ADMIN:
        can(Actions.Manage, User)
        break
      case Role.RESELLER:
        can(Actions.Read, User)
        can(Actions.Update, User, { id: user.id })
        break
      case Role.ASSISTANT:
        can(Actions.Read, User)
        can(Actions.Create, User)
        break
      default:
        can(Actions.Create, User)
        break
    }
  }
}
