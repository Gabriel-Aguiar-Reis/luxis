import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { UUID } from 'crypto'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'

@Injectable()
export class SellProductUseCase {
  constructor(
    @Inject('ProductRepository') private readonly productRepo: ProductRepository
  ) {}

  async execute(id: UUID): Promise<Product> {
    let product = await this.productRepo.findById(id)
    if (!product) {
      throw new NotFoundException('Product not found')
    }
    return await this.productRepo.updateStatus(id, ProductStatus.SOLD)
  }
}
