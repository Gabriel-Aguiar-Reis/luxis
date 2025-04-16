import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'

export abstract class ProductModelRepository {
  abstract findAll(): Promise<ProductModel[]>
  abstract findById(id: string): Promise<ProductModel | null>
  abstract create(model: ProductModel): Promise<ProductModel>
  abstract update(model: ProductModel): Promise<ProductModel>
  abstract delete(id: string): Promise<void>
}
