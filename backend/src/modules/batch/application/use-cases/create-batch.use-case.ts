import { Injectable, Inject } from '@nestjs/common'
import { CreateBatchDto } from '@/modules/batch/application/dtos/create-batch.dto'
import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { BatchFactory } from '@/modules/batch/domain/services/batch.factory'
import { GetBatchQtyByMonthUseCase } from '@/modules/batch/application/use-cases/get-batch-qty-by-month.use-case'
import crypto from 'crypto'
import { IBatchItemResolver } from '@/modules/batch/domain/services/batch-item-resolver.interface'
import { Unit } from '@/shared/common/value-object/unit.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
@Injectable()
export class CreateBatchUseCase {
  constructor(
    @Inject('BatchRepository')
    private readonly batchRepository: BatchRepository,

    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,

    private readonly getBatchQtyByMonthUseCase: GetBatchQtyByMonthUseCase,

    @Inject('BatchItemResolver')
    private readonly batchItemResolver: IBatchItemResolver
  ) {}

  async execute(input: CreateBatchDto): Promise<Batch> {
    const batchIndex = await this.getBatchQtyByMonthUseCase.execute(
      input.arrivalDate
    )
    const batchId = crypto.randomUUID()

    const rawItems = input.items.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
      quantity: new Unit(item.quantity),
      unitCost: new Currency(item.unitCost),
      salePrice: new Currency(item.salePrice),
      modelName: item.modelName ? new ModelName(item.modelName) : undefined
    }))
    const resolvedItems = await Promise.all(
      rawItems.map((item) => this.batchItemResolver.resolve(item))
    )

    const { batch, products } = await BatchFactory.createFromResolvedItems(
      batchId,
      input.arrivalDate,
      input.supplierId,
      resolvedItems,
      batchIndex
    )

    await this.batchRepository.create(batch)
    await Promise.all(
      products.map((product) => this.productRepository.create(product))
    )

    return batch
  }
}
