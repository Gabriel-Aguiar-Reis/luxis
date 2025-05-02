import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class DeleteProductModelUseCase {
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository
  ) {}

  async execute(id: UUID): Promise<void> {
    let productModel = await this.productModelRepository.findById(id)
    if (!productModel) {
      throw new NotFoundException('Product Model not found')
    }
    return await this.productModelRepository.delete(id)
  }
}
