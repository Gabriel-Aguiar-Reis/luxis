import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { UUID } from 'crypto'

export abstract class ProductRepository {
  abstract findAll(): Promise<Product[]>
  abstract findById(id: UUID): Promise<Product | null>
  abstract findByBatchId(batchId: UUID): Promise<Product[]>
  abstract create(product: Product): Promise<Product>
  abstract update(product: Product): Promise<Product>
  abstract updateStatus(id: UUID, status: ProductStatus): Promise<Product>
  abstract delete(id: UUID): Promise<void>
}
