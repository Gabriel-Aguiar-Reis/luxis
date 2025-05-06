import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { UpdateProductDto } from '@/modules/product/presentation/dtos/update-product.dto'
import { UUID } from 'crypto'
import { Currency } from '@/shared/common/value-object/currency.vo'

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('ProductRepository') private readonly productRepo: ProductRepository
  ) {}

  async execute(id: UUID, input: UpdateProductDto): Promise<Product> {
    let product = await this.productRepo.findById(id)
    if (!product) {
      throw new NotFoundException('Product not found')
    }
    product! = new Product(
      product.id,
      product.serialNumber,
      product.modelId,
      product.batchId,
      input.unitCost ? new Currency(input.unitCost) : product.unitCost,
      input.salePrice ? new Currency(input.salePrice) : product.salePrice,
      input.status ? input.status : product.status
    )

    return await this.productRepo.update(product)
  }
}
