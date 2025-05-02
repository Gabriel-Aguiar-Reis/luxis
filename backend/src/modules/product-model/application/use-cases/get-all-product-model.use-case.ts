import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class GetAllProductModelUseCase {
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository
  ) {}

  async execute(): Promise<ProductModel[]> {
    return await this.productModelRepository.findAll()
  }
}
