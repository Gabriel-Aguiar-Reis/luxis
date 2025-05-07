import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { UpdateSaleStrategy } from '@/modules/sale/application/use-cases/update/strategies/update-sale.strategy'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { ISalePriceCalculator } from '@/modules/sale/domain/services/sale-price-calculator.interface'
import { UpdateSaleDto } from '@/modules/sale/presentation/dtos/update-sale.dto'
import { Inject, ForbiddenException, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

export class UpdateSaleAdminStrategy implements UpdateSaleStrategy {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository,
    @Inject('SalePriceCalculator')
    private readonly salePriceCalculator: ISalePriceCalculator
  ) {}

  async execute(id: UUID, dto: UpdateSaleDto): Promise<Sale> {
    let sale = await this.saleRepository.findById(id)
    if (!sale) {
      throw new NotFoundException('Sale not found')
    }

    const products = await this.productRepository.findManyByIds(dto.productIds)
    const forSaleProducts = products.filter(
      (product) => product.status !== ProductStatus.SOLD
    )

    if (forSaleProducts.length === 0) {
      throw new ForbiddenException(
        'There are no new products to add to the sale'
      )
    }

    const totalAmount = await this.salePriceCalculator.calculateTotal(
      dto.productIds
    )

    sale = new Sale(
      sale.id,
      sale.resellerId,
      dto.productIds,
      sale.saleDate,
      totalAmount,
      sale.paymentMethod,
      sale.numberInstallments
    )

    return this.saleRepository.update(sale)
  }
}
