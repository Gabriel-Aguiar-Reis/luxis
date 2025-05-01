import { Injectable, ForbiddenException, Inject } from '@nestjs/common'
import { CreateSaleDto } from '@/modules/sale/presentation/dtos/create-sale.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { CreateSaleStrategy } from '@/modules/sale/application/use-cases/create/strategies/create-sale.strategy'
import { SalePriceCalculator } from '@/modules/sale/domain/services/sale-price-calculator.interface'
import { InventoryOwnershipVerifier } from '@/modules/sale/domain/services/inventory-ownership-verify.interface'

@Injectable()
export class CreateSaleResellerStrategy implements CreateSaleStrategy {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository,
    @Inject('SalePriceCalculator')
    private readonly salePriceCalculator: SalePriceCalculator,
    @Inject('InventoryOwnershipVerifier')
    private readonly inventoryOwnershipVerifier: InventoryOwnershipVerifier
  ) {}

  async execute(dto: CreateSaleDto, user: UserPayload): Promise<Sale> {
    await this.inventoryOwnershipVerifier.verifyOwnership(
      user.id,
      dto.productIds
    )

    const totalAmount = await this.salePriceCalculator.calculateTotal(
      dto.productIds
    )

    const sale = new Sale(
      crypto.randomUUID(),
      user.id,
      dto.productIds,
      dto.saleDate,
      totalAmount
    )

    return this.saleRepository.create(sale)
  }
}
