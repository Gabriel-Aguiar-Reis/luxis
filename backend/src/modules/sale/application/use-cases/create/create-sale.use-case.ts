import { CreateSaleStrategyFactory } from '@/modules/sale/application/use-cases/create/strategies/create-sale.strategy.factory'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { CreateSaleDto } from '@/modules/sale/presentation/dtos/create-sale.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateSaleUseCase {
  constructor(private readonly strategyFactory: CreateSaleStrategyFactory) {}

  async execute(dto: CreateSaleDto, user: UserPayload): Promise<Sale> {
    const strategy = this.strategyFactory.getStrategy(user.role)
    return await strategy.execute(dto, user)
  }
}
