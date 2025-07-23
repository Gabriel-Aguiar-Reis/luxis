import { Injectable, Inject } from '@nestjs/common'
import { CreateBatchDto } from '@/modules/batch/application/dtos/create-batch.dto'
import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { BatchFactory } from '@/modules/batch/domain/services/batch.factory'
import { GetBatchQtyByMonthUseCase } from '@/modules/batch/application/use-cases/get-batch-qty-by-month.use-case'
import * as crypto from 'crypto'
import { IProductEntryResolver } from '@/modules/batch/domain/services/product-entry-resolver.interface'
@Injectable()
export class CreateBatchUseCase {
  constructor(
    @Inject('BatchRepository')
    private readonly batchRepository: BatchRepository,

    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,

    private readonly getBatchQtyByMonthUseCase: GetBatchQtyByMonthUseCase,

    @Inject('ProductEntryResolver')
    private readonly productEntryResolver: IProductEntryResolver
  ) {}

  async execute(input: CreateBatchDto): Promise<Batch> {
    const batchId = crypto.randomUUID()
    const batchIndex = await this.getBatchQtyByMonthUseCase.execute(
      input.arrivalDate
    )

    const resolvedEntries = await Promise.all(
      input.entries.map((entry) => this.productEntryResolver.resolve(entry))
    )

    const { batch, products } = await BatchFactory.create(
      batchId,
      input.arrivalDate,
      input.supplierId,
      resolvedEntries,
      batchIndex
    )

    await this.batchRepository.create(batch)
    await Promise.all(products.map((p) => this.productRepository.create(p)))

    return batch
  }
}
