import { Product } from '@/modules/product/domain/entities/product.entity'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { SerialNumber } from '@/modules/product/domain/value-objects/serial-number.vo'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'

export class ProductMapper {
  static toDomain(entity: ProductTypeOrmEntity): Product {
    return new Product(
      entity.id,
      new SerialNumber(entity.serialNumber),
      entity.modelId,
      entity.batchId,
      new Currency(entity.unitCost.toString()),
      new Currency(entity.salePrice.toString()),
      entity.status
    )
  }

  static toTypeOrm(product: Product): ProductTypeOrmEntity {
    const entity = new ProductTypeOrmEntity()
    entity.id = product.id
    entity.serialNumber = product.serialNumber.getValue()
    entity.modelId = product.modelId
    entity.batchId = product.batchId
    entity.unitCost = Number(product.unitCost.getValue())
    entity.salePrice = Number(product.salePrice.getValue())
    entity.status = product.status
    return entity
  }

  static toPersistence(product: Product): any {
    return {
      id: product.id,
      serialNumber: product.serialNumber.getValue(),
      modelId: product.modelId,
      batchId: product.batchId,
      unitCost: product.unitCost.getValue(),
      salePrice: product.salePrice.getValue(),
      status: product.status
    }
  }

  static toResponse(product: Product): any {
    return {
      id: product.id,
      serialNumber: product.serialNumber.getValue(),
      modelId: product.modelId,
      batchId: product.batchId,
      unitCost: product.unitCost.getValue(),
      salePrice: product.salePrice.getValue(),
      status: product.status
    }
  }
}
