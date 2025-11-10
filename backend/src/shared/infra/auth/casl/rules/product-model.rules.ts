import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CaslRuleBuilder } from '@/shared/infra/auth/casl/interfaces/casl-rules.builder'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { AbilityBuilder } from '@casl/ability'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ProductModelCaslRule implements CaslRuleBuilder {
  buildFor(user: UserPayload, builder: AbilityBuilder<AppAbility>) {
    const { can } = builder

    switch (user.role) {
      case Role.ADMIN:
        can(Actions.Manage, ProductModel)
        break
      case Role.ASSISTANT:
        can(Actions.Read, ProductModel)
        can(Actions.Update, ProductModel)
        can(Actions.Create, ProductModel)
        break
      case Role.RESELLER:
        can(Actions.Read, ProductModel)
        break
    }
  }
}
