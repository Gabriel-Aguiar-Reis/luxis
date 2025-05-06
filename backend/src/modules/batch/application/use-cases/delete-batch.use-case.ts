import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { UUID } from 'crypto'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'

@Injectable()
export class DeleteBatchUseCase {
  constructor(
    @Inject('BatchRepository')
    private readonly batchRepository: BatchRepository,

    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository
  ) {}

  async execute(batchId: UUID): Promise<void> {
    const batch = await this.batchRepository.findById(batchId)
    if (!batch) throw new NotFoundException('Batch not found')

    const products = await this.productRepository.findByBatchId(batchId)

    const nonDeletable = products.filter(
      (product) => product.status !== ProductStatus.IN_STOCK
    )

    if (nonDeletable.length > 0) {
      throw new BadRequestException(
        `Batch cannot be deleted. Some products are not in stock (${nonDeletable.length}).`
      )
    }

    await Promise.all(
      products.map((product) => this.productRepository.delete(product.id))
    )

    await this.batchRepository.delete(batchId)
  }
}
