import { Injectable } from '@nestjs/common'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { GetOneSaleAdminOrAssistantStrategy } from '@/modules/sale/application/use-cases/get-one/strategies/get-one-sale-admin-or-assistant.strategy'
import { GetOneSaleResellerStrategy } from '@/modules/sale/application/use-cases/get-one/strategies/get-one-sale-reseller.strategy'
import { GetOneSaleStrategy } from '@/modules/sale/application/use-cases/get-one/strategies/get-one-sale.strategy'

@Injectable()
export class GetOneSaleStrategyFactory {
  constructor(
    private readonly resellerStrategy: GetOneSaleResellerStrategy,
    private readonly adminOrAssistantStrategy: GetOneSaleAdminOrAssistantStrategy
  ) {}

  getStrategy(role: Role): GetOneSaleStrategy {
    switch (role) {
      case Role.RESELLER:
        return this.resellerStrategy
      case Role.ADMIN || Role.ASSISTANT:
        return this.adminOrAssistantStrategy
      default:
        throw new Error(`No strategy defined for role ${role}`)
    }
  }
}
