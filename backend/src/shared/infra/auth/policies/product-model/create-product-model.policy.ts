import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { IPolicyHandler } from '@/shared/infra/auth/interfaces/policy-handler.interface'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateProductModelPolicy implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Create, ProductModel)
  }
}
