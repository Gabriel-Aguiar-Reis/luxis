import { GetSaleDto } from '@/modules/sale/application/dtos/get-sale.dto'
import { GetOneSaleStrategyFactory } from '@/modules/sale/application/use-cases/get-one/strategies/get-one-sale.strategy.factory'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Injectable } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetOneSaleUseCase {
  constructor(private readonly strategyFactory: GetOneSaleStrategyFactory) {}

  async execute(id: UUID, user: UserPayload): Promise<GetSaleDto> {
    const strategy = this.strategyFactory.getStrategy(user.role)
    return await strategy.execute(id, user)
  }
}
