import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { UUID } from 'crypto'

@Injectable()
export class GetOneProductUseCase {
  constructor(
    @Inject('ProductRepository') private readonly productRepo: ProductRepository
  ) {}

  async execute(id: UUID): Promise<Product> {
    const product = await this.productRepo.findById(id)
    if (!product) {
      throw new NotFoundException('Product not found')
    }
    return product
  }
}
