import { UpdateSaleStrategyFactory } from '@/modules/sale/application/use-cases/update/strategies/update-sale.strategy.factory'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { UpdateSaleDto } from '@/modules/sale/application/dtos/update-sale.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Injectable } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class UpdateSaleUseCase {
  constructor(private readonly strategyFactory: UpdateSaleStrategyFactory) {}

  async execute(
    id: UUID,
    dto: UpdateSaleDto,
    user: UserPayload
  ): Promise<Sale> {
    const strategy = this.strategyFactory.getStrategy(user.role)
    return await strategy.execute(id, dto, user)
  }
}
