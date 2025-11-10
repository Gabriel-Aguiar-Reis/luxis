import { Currency } from '@/shared/common/value-object/currency.vo'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { ProductEntryDto } from '@/modules/batch/application/dtos/product-entry-dto'
import { ResolvedProductEntry } from '@/modules/batch/application/models/resolved-product-entry.model'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Unit } from '@/shared/common/value-object/unit.vo'
import { ProductModelStatus } from '@/modules/product-model/domain/enums/product-model-status.enum'

@Injectable()
export class ProductEntryResolver {
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepo: ProductModelRepository,
    @Inject('CategoryRepository')
    private readonly categoryRepo: CategoryRepository,
    private readonly logger: CustomLogger
  ) {}

  async resolve(entry: ProductEntryDto): Promise<ResolvedProductEntry> {
    let model = entry.modelId
      ? await this.productModelRepo.findById(entry.modelId)
      : null

    if (
      !model &&
      (!entry.modelName ||
        !entry.categoryId ||
        !entry.salePrice ||
        !entry.unitCost)
    ) {
      throw new BadRequestException(
        'Model name, categoryId, unitCost and salePrice are required'
      )
    }

    if (!model) {
      model = await this.productModelRepo.create(
        new ProductModel(
          crypto.randomUUID(),
          new ModelName(entry.modelName!),
          entry.categoryId!,
          new Currency(entry.salePrice!),
          ProductModelStatus.USED,
          new Description(''),
          new ImageURL(
            entry.photoUrl ??
              'https://dummyimage.com/500x500/cccccc/000000.png&text=Luxis'
          )
        )
      )
    }

    const category = await this.categoryRepo.findById(model.categoryId)
    if (!category)
      throw new NotFoundException(`Category not found for model ${model.id}`)

    this.logger.log(`Resolved product entry: ${JSON.stringify(entry)}`)

    return new ResolvedProductEntry(
      model.id,
      model.name,
      category.name.getValue().slice(0, 2).toUpperCase(),
      new Unit(entry.quantity),
      new Currency(entry.unitCost),
      new Currency(entry.salePrice)
    )
  }
}
