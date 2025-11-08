import { Injectable, ForbiddenException, Inject } from '@nestjs/common'
import { CreateSaleDto } from '@/modules/sale/application/dtos/create-sale.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { CreateSaleStrategy } from '@/modules/sale/application/use-cases/create/strategies/create-sale.strategy'
import { ISalePriceCalculator } from '@/modules/sale/domain/services/sale-price-calculator.interface'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'
import { Unit } from '@/shared/common/value-object/unit.vo'

@Injectable()
export class CreateSaleAdminStrategy implements CreateSaleStrategy {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository,
    @Inject('SalePriceCalculator')
    private readonly salePriceCalculator: ISalePriceCalculator
  ) {}

  async execute(dto: CreateSaleDto, user: UserPayload): Promise<Sale> {
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
