import { Inject, Injectable } from '@nestjs/common'

import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'

@Injectable()
export class GetAllProductUseCase {
  constructor(
    @Inject('ProductRepository') private readonly productRepo: ProductRepository
  ) {}

  async execute(): Promise<Product[]> {
    return await this.productRepo.findAll()
  }
}
