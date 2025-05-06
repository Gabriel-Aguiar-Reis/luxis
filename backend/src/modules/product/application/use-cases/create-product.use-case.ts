import { Inject, Injectable } from '@nestjs/common'
import * as crypto from 'crypto'

import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { CreateProductDto } from '@/modules/product/presentation/dtos/create-product.dto'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { SerialNumber } from '@/modules/product/domain/value-objects/serial-number.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepository') private readonly productRepo: ProductRepository
  ) {}

  async execute(input: CreateProductDto): Promise<Product> {
    const product = new Product(
      crypto.randomUUID(),
      new SerialNumber(input.serialNumber),
      input.modelId,
      input.batchId,
      new Currency(input.unitCost),
      new Currency(input.salePrice),
      ProductStatus.IN_STOCK
    )
    return await this.productRepo.create(product)
  }
}
