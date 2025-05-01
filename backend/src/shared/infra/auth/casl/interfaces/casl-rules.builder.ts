import { AbilityBuilder, AnyAbility } from '@casl/ability'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UUID } from 'crypto'

export interface CaslRuleBuilder {
  buildFor(
    user: { id: UUID; role: Role },
    builder: AbilityBuilder<AnyAbility>
  ): void
}
