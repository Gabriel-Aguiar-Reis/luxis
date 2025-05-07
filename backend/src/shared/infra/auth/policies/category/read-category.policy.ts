import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { IPolicyHandler } from '@/shared/infra/auth/interfaces/policy-handler.interface'
import { Category } from '@/modules/category/domain/entities/category.entity'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ReadCategoryPolicy implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Read, Category)
  }
}
