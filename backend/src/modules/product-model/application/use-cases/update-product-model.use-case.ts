import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { UpdateProductModelDto } from '@/modules/product-model/presentation/dtos/update-product-model.dto'
import { CloudinaryService } from '@/modules/shared/infra/cloudinary/cloudinary.service'
import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'

@Injectable()
export class UpdateProductModelUseCase {
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async execute(id: UUID, input: UpdateProductModelDto): Promise<ProductModel> {
    let model = await this.productModelRepository.findById(id)
    if (!model) {
      throw new NotFoundException('Model not found')
    }
    const photoUrl = input.photo
      ? new ImageURL(
          await this.cloudinaryService.uploadImage(
            input.photo,
            'product-models'
          )
        )
      : model.photoUrl

    model = new ProductModel(
      id,
      input.name ?? model.name,
      input.categoryId ?? model.categoryId,
      input.suggestedPrice ?? model.suggestedPrice,
      input.description ?? model.description,
      photoUrl
    )
    return await this.productModelRepository.update(model)
  }
}
