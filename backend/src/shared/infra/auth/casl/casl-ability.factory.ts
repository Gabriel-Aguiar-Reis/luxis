import { Injectable, Inject } from '@nestjs/common'
import { AbilityBuilder, PureAbility, ExtractSubjectType } from '@casl/ability'
import { CaslRuleBuilder } from '@/shared/infra/auth/casl/interfaces/casl-rules.builder'
import { AppAbility, Subjects } from '@/shared/infra/auth/casl/casl-types'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'

export { AppAbility } from '@/shared/infra/auth/casl/casl-types'

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @Inject('CASL_RULE_BUILDERS')
    private readonly ruleBuilders: CaslRuleBuilder[]
  ) {}

  createForUser(user: UserPayload): AppAbility {
    const builder = new AbilityBuilder<AppAbility>(PureAbility)

    for (const builderFn of this.ruleBuilders) {
      builderFn.buildFor(user, builder)
    }

    const conditionsMatcher = (matchConditions: unknown) => {
      const conditions = matchConditions as Record<string, unknown>
      return (object: Record<string, unknown>) => {
        return Object.keys(conditions).every((key) => {
          return object[key] === conditions[key]
        })
      }
    }

    return builder.build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher
    })
  }
}
