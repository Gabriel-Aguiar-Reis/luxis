import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { CreateProductModelDto } from '@/modules/product-model/presentation/dtos/create-product-model.dto'
import { CloudinaryService } from '@/shared/infra/cloudinary/cloudinary.service'
import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class CreateProductModelUseCase {
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async execute(input: CreateProductModelDto): Promise<ProductModel> {
    const photoUrl = input.photo
      ? new ImageURL(
          await this.cloudinaryService.uploadImage(
            input.photo,
            'product-models'
          )
        )
      : undefined
    const model = new ProductModel(
      crypto.randomUUID(),
      input.name,
      input.categoryId,
      input.suggestedPrice,
      input.description ?? undefined,
      photoUrl
    )
    return await this.productModelRepository.create(model)
  }
}
