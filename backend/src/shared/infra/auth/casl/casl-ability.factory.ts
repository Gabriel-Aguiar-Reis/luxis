import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { Category } from '@/modules/category/domain/entities/category.entity'
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
import { User } from '@/modules/user/domain/entities/user.entity'
import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'

type Subjects =
  | InferSubjects<typeof Batch>
  | InferSubjects<typeof Category>
  | InferSubjects<typeof OwnershipTransfer>
  | InferSubjects<typeof Product>
  | InferSubjects<typeof ProductModel>
  | InferSubjects<typeof Sale>
  | InferSubjects<typeof Shipment>
  | InferSubjects<typeof User>
  | 'all'

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
