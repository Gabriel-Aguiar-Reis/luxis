import { BatchItem } from '@/modules/batch/domain/entities/batch-item.entity'
import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { CreateBatchDto } from '@/modules/batch/presentation/dtos/create-batch.dto'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { ProductModelRepository } from '@/modules/product-model/domain/repository/product-model.repository'
import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { SerialNumber } from '@/modules/product/domain/value-objects/serial-number.vo'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class CreateBatchUseCase {
  constructor(
    @Inject('BatchRepository')
    private readonly batchRepository: BatchRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository,
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository
  ) {}

  private async getBatchIndexForMonth(date: Date): Promise<number> {
    const allBatchesInMonth = await this.batchRepository.findAllByMonthAndYear(
      date.getMonth() + 1,
      date.getFullYear()
    )
    return allBatchesInMonth.length // Se for o 1º, retorna 0 → "A"
  }

  async execute(input: CreateBatchDto): Promise<Batch> {
    const batchIndex = await this.getBatchIndexForMonth(input.arrivalDate)

    const batch = new Batch(
      crypto.randomUUID(),
      input.arrivalDate,
      input.supplierId,
      input.items
    )

    for (let item of batch.items) {
      let model = await this.productModelRepository.findById(item.modelId)
      if (!model && (!item.modelName || !item.categoryId)) {
        throw new Error(
          `Batch item model name and category id are required when model id is not provided`
        )
      }
      if (!model && item.modelName && item.categoryId) {
        item = await BatchItem.withNewModel(
          item.id,
          item.modelName,
          item.categoryId,
          item.quantity,
          item.unitCost,
          item.salePrice,
          this.productModelRepository
        )
      }
      item = BatchItem.withExistingModel(
        item.id,
        item.modelId,
        item.quantity,
        item.unitCost,
        item.salePrice
      )

      const category = await this.categoryRepository.findById(model!.categoryId)
      if (!category)
        throw new Error(`Category not found for model ${model!.id}`)

      const categoryCode = category.name.getValue().slice(0, 2).toUpperCase()
      const modelName = model!.name

      for (let i = 0; i < item.quantity.getValue(); i++) {
        const serial = SerialNumber.generate(
          batch.arrivalDate,
          batchIndex,
          categoryCode,
          modelName,
          i
        )

        const product = new Product(
          crypto.randomUUID(),
          serial,
          item.modelId,
          batch.id,
          item.unitCost,
          item.unitCost,
          ProductStatus.IN_STOCK
        )

        await this.productRepository.create(product)
      }
    }

    return this.batchRepository.create(batch)
  }
}
