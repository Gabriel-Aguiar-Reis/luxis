import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { RawBatchItem } from '@/modules/batch/application/models/raw-batch-item.model'
import { BatchItemWithResolvedModel } from '@/modules/batch/application/models/batch-item-with-resolved-model.model'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { InjectPinoLogger } from 'nestjs-pino'
import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'
import { Description } from '@/shared/common/value-object/description.vo'

@Injectable()
export class BatchItemResolver {
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepo: ProductModelRepository,
    @Inject('CategoryRepository')
    private readonly categoryRepo: CategoryRepository,
    @InjectPinoLogger()
    private readonly logger: CustomLogger
  ) {}

  async resolve(batchItem: RawBatchItem): Promise<BatchItemWithResolvedModel> {
    this.logger.warn(
      `Resolving batch item ${batchItem.id}`,
      'BatchItemResolver'
    )
    let model: ProductModel | null = null

    if (batchItem.modelId) {
      model = await this.productModelRepo.findById(batchItem.modelId)
    }

    if (
      !model &&
      (!batchItem.modelName ||
        !batchItem.categoryId ||
        !batchItem.salePrice ||
        !batchItem.unitCost)
    ) {
      throw new BadRequestException(
        'Model name, categoryId and salePrice are required to create a new model.'
      )
    }

    if (!model) {
      model = await this.productModelRepo.create(
        new ProductModel(
          crypto.randomUUID(),
          batchItem.modelName!,
          batchItem.categoryId!,
          batchItem.salePrice!,
          new Description(''),
          new ImageURL(
            batchItem.photoUrl
              ? batchItem.photoUrl.getValue()
              : 'https://dummyimage.com/500x500/cccccc/000000.png&text=Luxis'
          )
        )
      )
    }
    const category = await this.categoryRepo.findById(model.categoryId)
    if (!category) {
      throw new NotFoundException(`Category not found for model ${model.id}.`)
    }

    const categoryCode = category.name.getValue().slice(0, 2).toUpperCase()

    this.logger.warn(
      `Resolved batch item ${batchItem.id} with model ${model.id} and category ${category.id}`,
      'BatchItemResolver'
    )
    return {
      batchItem,
      model,
      categoryCode
    }
  }
}
