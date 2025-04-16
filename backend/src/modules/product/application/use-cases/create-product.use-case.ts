import { Inject, Injectable } from '@nestjs/common'
import * as crypto from 'crypto'

import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { CreateProductDto } from '@/modules/product/presentation/dtos/create-product.dto'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepository') private readonly productRepo: ProductRepository
  ) {}

  async execute(input: CreateProductDto): Promise<Product> {
    const product = new Product(
      crypto.randomUUID(),
      input.serialNumber,
      input.modelId,
      input.batchId,
      input.unitCost,
      input.salePrice,
      ProductStatus.IN_STOCK
    )
    return await this.productRepo.create(product)
  }
}
