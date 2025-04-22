import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repository/product-model.repository'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetOneProductModelUseCase {
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository
  ) {}

  async execute(id: UUID): Promise<ProductModel> {
    let productModel = await this.productModelRepository.findById(id)
    if (!productModel) {
      throw new NotFoundException('Product model not found')
    }
    return productModel
  }
}
