import { UpdateSaleStrategy } from '@/modules/sale/application/use-cases/update/strategies/update-sale.strategy'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { IInventoryOwnershipVerifier } from '@/modules/sale/domain/services/inventory-ownership-verify.interface'
import { ISalePriceCalculator } from '@/modules/sale/domain/services/sale-price-calculator.interface'
import { UpdateSaleDto } from '@/modules/sale/application/dtos/update-sale.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Inject, ForbiddenException, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

export class UpdateSaleResellerStrategy implements UpdateSaleStrategy {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository,
    @Inject('SalePriceCalculator')
    private readonly salePriceCalculator: ISalePriceCalculator,
    @Inject('InventoryOwnershipVerifier')
    private readonly inventoryOwnershipVerifier: IInventoryOwnershipVerifier
  ) {}

  async execute(
    id: UUID,
    dto: UpdateSaleDto,
    user: UserPayload
  ): Promise<Sale> {
    let sale = await this.saleRepository.findById(id)
    if (!sale) {
      throw new NotFoundException('Sale not found')
    }
    if (sale.resellerId !== user.id) {
      throw new ForbiddenException('You are not authorized to update this sale')
    }

    await this.inventoryOwnershipVerifier.verifyOwnership(
      user.id,
      dto.productIds ?? sale.productIds,
      user
    )

    const totalAmount = await this.salePriceCalculator.calculateTotal(
      dto.productIds ?? sale.productIds
    )

    sale = new Sale(
      sale.id,
      sale.customerId,
      sale.resellerId,
      dto.productIds ?? sale.productIds,
      sale.saleDate,
      totalAmount,
      sale.paymentMethod,
      sale.numberInstallments
    )

    return this.saleRepository.update(sale)
  }
}
