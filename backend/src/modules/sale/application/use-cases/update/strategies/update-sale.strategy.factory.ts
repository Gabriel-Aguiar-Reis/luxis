import { Injectable } from '@nestjs/common'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UpdateSaleAdminStrategy } from '@/modules/sale/application/use-cases/update/strategies/update-sale-admin.strategy'
import { UpdateSaleStrategy } from '@/modules/sale/application/use-cases/update/strategies/update-sale.strategy'
import { UpdateSaleResellerStrategy } from '@/modules/sale/application/use-cases/update/strategies/update-sale-reseller.strategy'

@Injectable()
export class UpdateSaleStrategyFactory {
  constructor(
    private readonly resellerStrategy: UpdateSaleResellerStrategy,
    private readonly adminStrategy: UpdateSaleAdminStrategy
  ) {}

  getStrategy(role: Role): UpdateSaleStrategy {
    switch (role) {
      case Role.RESELLER:
        return this.resellerStrategy
      case Role.ADMIN:
        return this.adminStrategy
      default:
        throw new Error(`No strategy defined for role ${role}`)
    }
  }
}
