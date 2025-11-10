import { Injectable, ForbiddenException, Inject } from '@nestjs/common'
import { CreateSaleDto } from '@/modules/sale/application/dtos/create-sale.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { CreateSaleStrategy } from '@/modules/sale/application/use-cases/create/strategies/create-sale.strategy'
import { ISalePriceCalculator } from '@/modules/sale/domain/services/sale-price-calculator.interface'
import { IInventoryOwnershipVerifier } from '@/modules/sale/domain/services/inventory-ownership-verify.interface'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'
import { Unit } from '@/shared/common/value-object/unit.vo'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'

@Injectable()
export class CreateSaleResellerStrategy implements CreateSaleStrategy {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository,
    @Inject('SalePriceCalculator')
    private readonly salePriceCalculator: ISalePriceCalculator,
    @Inject('InventoryOwnershipVerifier')
    private readonly inventoryOwnershipVerifier: IInventoryOwnershipVerifier
  ) {}

  async execute(dto: CreateSaleDto, user: UserPayload): Promise<Sale> {
    await this.inventoryOwnershipVerifier.verifyOwnership(
      user.id,
      dto.productIds,
      user
    )

    const totalAmount = await this.salePriceCalculator.calculateTotal(
      dto.productIds
    )

    const sale = new Sale(
      crypto.randomUUID(),
      dto.customerId,
      user.id,
      dto.productIds,
      dto.saleDate,
      totalAmount,
      dto.paymentMethod,
      new Unit(dto.numberInstallments),
      SaleStatus.PENDING,
      new Unit(dto.installmentsInterval)
    )

    return await this.saleRepository.create(sale)
  }
}
