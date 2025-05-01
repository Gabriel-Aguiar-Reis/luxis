import { Injectable, Inject } from '@nestjs/common'
import {
  AbilityBuilder,
  PureAbility,
  InferSubjects,
  ExtractSubjectType
} from '@casl/ability'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { UUID } from 'crypto'
import { CaslRuleBuilder } from '@/shared/infra/auth/casl/interfaces/casl-rules.builder'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'

type Subjects = InferSubjects<typeof Sale> | 'all'
export type AppAbility = PureAbility<[Actions, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @Inject('CASL_RULE_BUILDERS')
    private readonly ruleBuilders: CaslRuleBuilder[]
  ) {}

  createForUser(user: { id: UUID; role: Role }): AppAbility {
    const builder = new AbilityBuilder<AppAbility>(PureAbility)

    for (const builderFn of this.ruleBuilders) {
      builderFn.buildFor(user, builder)
    }

    return builder.build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>
    })
  }
}
