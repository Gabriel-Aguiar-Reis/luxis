import { BadRequestException, Injectable } from '@nestjs/common'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { CreateSaleAdminStrategy } from '@/modules/sale/application/use-cases/create/strategies/create-sale-admin.strategy'
import { CreateSaleResellerStrategy } from '@/modules/sale/application/use-cases/create/strategies/create-sale-reseller.strategy'
import { CreateSaleStrategy } from '@/modules/sale/application/use-cases/create/strategies/create-sale.strategy'

@Injectable()
export class CreateSaleStrategyFactory {
  constructor(
    private readonly resellerStrategy: CreateSaleResellerStrategy,
    private readonly adminStrategy: CreateSaleAdminStrategy
  ) {}

  getStrategy(role: Role): CreateSaleStrategy {
    switch (role) {
      case Role.RESELLER:
        return this.resellerStrategy
      case Role.ADMIN:
        return this.adminStrategy
      default:
        throw new BadRequestException(`No strategy defined for role ${role}`)
    }
  }
}
