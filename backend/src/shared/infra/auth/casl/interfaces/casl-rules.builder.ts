import { AbilityBuilder } from '@casl/ability'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { AppAbility } from '@/shared/infra/auth/casl/casl-types'

export interface CaslRuleBuilder {
  buildFor(user: UserPayload, builder: AbilityBuilder<AppAbility>): void
}
