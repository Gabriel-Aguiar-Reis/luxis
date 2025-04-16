import { Product } from '@/modules/product/domain/entities/product.entity'

export abstract class ProductRepository {
  abstract findAll(): Promise<Product[]>
  abstract findById(id: string): Promise<Product | null>
  abstract create(product: Product): Promise<Product>
  abstract update(product: Product): Promise<Product>
  abstract updateStatus(id: string, status: string): Promise<Product>
  abstract delete(id: string): Promise<void>
}
