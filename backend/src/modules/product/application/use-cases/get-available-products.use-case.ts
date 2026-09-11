import { Injectable, Inject } from '@nestjs/common'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'

@Injectable()
export class GetAvailableProductsUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepository
  ) {}

  async execute(): Promise<Product[]> {
    return await this.productRepo.findByStatus(ProductStatus.IN_STOCK)
  }
}
