import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repository/product-model.repository'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { UpdateProductModelDto } from '@/modules/product-model/presentation/dtos/update-product-model.dto'

@Injectable()
export class UpdateProductModelUseCase {
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository
  ) {}

  async execute(id: UUID, input: UpdateProductModelDto): Promise<ProductModel> {
    let model = await this.productModelRepository.findById(id)
    if (!model) {
      throw new NotFoundException('Model not found')
    }
    model = new ProductModel(
      crypto.randomUUID(),
      input.name,
      input.categoryId,
      input.suggestedPrice,
      input.description ?? undefined
    )
    return await this.productModelRepository.create(model)
  }
}
