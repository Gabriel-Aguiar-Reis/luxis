import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { UUID } from 'crypto'

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('ProductRepository') private readonly productRepo: ProductRepository
  ) {}

  async execute(id: UUID): Promise<void> {
    const product = await this.productRepo.findById(id)
    if (!product) {
      throw new NotFoundException('Product not found')
    }
    return this.productRepo.delete(id)
  }
}
