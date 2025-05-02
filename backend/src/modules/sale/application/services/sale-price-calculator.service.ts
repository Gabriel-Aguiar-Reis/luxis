import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ISalePriceCalculator } from '@/modules/sale/domain/services/sale-price-calculator.interface'

@Injectable()
export class SalePriceCalculatorService implements ISalePriceCalculator {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository
  ) {}

  async calculateTotal(productIds: UUID[]): Promise<Currency> {
    const products = await this.productRepository.findManyByIds(productIds)

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found')
    }

    const total = products
      .map((p) => parseFloat(p.salePrice.getValue()))
      .reduce((sum, price) => sum + price, 0)

    return new Currency(total.toFixed(2))
  }
}
