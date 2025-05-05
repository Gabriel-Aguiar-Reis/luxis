import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { CloudinaryService } from '@/shared/infra/cloudinary/cloudinary.service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class DeleteProductModelUseCase {
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async execute(id: UUID): Promise<void> {
    let productModel = await this.productModelRepository.findById(id)
    if (!productModel) {
      throw new NotFoundException('Product Model not found')
    }
    if (productModel.photoUrl) {
      await this.cloudinaryService.deleteImage(productModel.photoUrl.getValue())
    }
    return await this.productModelRepository.delete(id)
  }
}
