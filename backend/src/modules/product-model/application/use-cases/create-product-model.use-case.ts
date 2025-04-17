import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repository/product-model.repository'
import { CreateProductModelDto } from '@/modules/product-model/presentation/dto/create-product-model.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateProductModelUseCase {
  constructor(private readonly repo: ProductModelRepository) {}

  async execute(input: CreateProductModelDto): Promise<ProductModel> {
    const model = new ProductModel(
      crypto.randomUUID(),
      input.name,
      input.categoryId,
      input.description
    )
    return await this.repo.create(model)
  }
}
