import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { GetAllProductModelStrategy } from '@/modules/product-model/application/use-cases/get-all/strategies/get-all-product-model.strategy'
import { Role } from '@/modules/user/domain/enums/user-role.enum'

@Injectable()
export class GetAllProductModelAssistantStrategy
  implements GetAllProductModelStrategy
{
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository
  ) {}

  async execute(user: UserPayload): Promise<ProductModel[]> {
    if (user.role !== Role.ASSISTANT) {
      throw new ForbiddenException('Only assistant can use this strategy')
    }

    return await this.productModelRepository.findAll()
  }
}
