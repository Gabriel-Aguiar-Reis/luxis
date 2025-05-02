import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { CreateProductModelDto } from '@/modules/product-model/presentation/dtos/create-product-model.dto'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class CreateProductModelUseCase {
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository
  ) {}

  async execute(input: CreateProductModelDto): Promise<ProductModel> {
    const model = new ProductModel(
      crypto.randomUUID(),
      input.name,
      input.categoryId,
      input.suggestedPrice,
      input.description ?? undefined
    )
    return await this.productModelRepository.create(model)
  }
}
