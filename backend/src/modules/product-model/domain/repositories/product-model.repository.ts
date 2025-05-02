import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { UUID } from 'crypto'

export abstract class ProductModelRepository {
  abstract findAll(): Promise<ProductModel[]>
  abstract findAllByResellerId(resellerId: UUID): Promise<ProductModel[]>
  abstract findById(id: UUID): Promise<ProductModel | null>
  abstract create(model: ProductModel): Promise<ProductModel>
  abstract update(model: ProductModel): Promise<ProductModel>
  abstract delete(id: UUID): Promise<void>
}
