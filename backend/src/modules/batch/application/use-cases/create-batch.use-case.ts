import { Injectable, Inject } from '@nestjs/common'
import { CreateBatchDto } from '@/modules/batch/presentation/dtos/create-batch.dto'
import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { BatchFactory } from '@/modules/batch/domain/services/batch.factory'
import { BatchItemResolver } from '@/modules/batch/application/services/batch-item-resolver.service'
import { GetBatchQtyByMonthUseCase } from '@/modules/batch/application/use-cases/get-batch-qty-by-month.use-case'
import crypto from 'crypto'

@Injectable()
export class CreateBatchUseCase {
  constructor(
    @Inject('BatchRepository')
    private readonly batchRepository: BatchRepository,

    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,

    private readonly getBatchQtyByMonthUseCase: GetBatchQtyByMonthUseCase,

    private readonly batchItemResolver: BatchItemResolver
  ) {}

  async execute(input: CreateBatchDto): Promise<Batch> {
    const batchIndex = await this.getBatchQtyByMonthUseCase.execute(
      input.arrivalDate
    )
    const batchId = crypto.randomUUID()

    const resolvedItems = await Promise.all(
      input.items.map((item) => this.batchItemResolver.resolve(item))
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
