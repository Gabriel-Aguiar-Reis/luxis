import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Injectable } from '@nestjs/common'
import { GetAllProductModelStrategyFactory } from './strategies/get-all-product-model.strategy.factory'

@Injectable()
export class GetAllProductModelUseCase {
  constructor(
    private readonly strategyFactory: GetAllProductModelStrategyFactory
  ) {}

  async execute(user: UserPayload): Promise<ProductModel[]> {
    const strategy = this.strategyFactory.create(user)
    return await strategy.execute(user)
  }
}
