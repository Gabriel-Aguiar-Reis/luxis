import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'

export class ProductModelMapper {
  static toDomain(entity: ProductModelTypeOrmEntity): ProductModel {
    return new ProductModel(
      entity.id,
      new ModelName(entity.name),
      entity.categoryId,
      new Currency(entity.suggestedPrice.toString()),
      entity.description ? new Description(entity.description) : undefined,
      entity.photoUrl ? new ImageURL(entity.photoUrl) : undefined
    )
  }

  static toTypeOrm(model: ProductModel): ProductModelTypeOrmEntity {
    const entity = new ProductModelTypeOrmEntity()
    entity.id = model.id
    entity.name = model.name.getValue()
    entity.categoryId = model.categoryId
    entity.suggestedPrice = Number(model.suggestedPrice.getValue())
    entity.description = model.description?.getValue() ?? ''
    return entity
  }

  static toPersistence(productModel: ProductModel): any {
    return {
      id: productModel.id,
      name: productModel.name.getValue(),
      categoryId: productModel.categoryId,
      suggestedPrice: productModel.suggestedPrice.getValue(),
      description: productModel.description?.getValue(),
      photoUrl: productModel.photoUrl?.getValue()
    }
  }

  static toResponse(productModel: ProductModel): any {
    return {
      id: productModel.id,
      name: productModel.name.getValue(),
      categoryId: productModel.categoryId,
      suggestedPrice: productModel.suggestedPrice.getValue(),
      description: productModel.description?.getValue(),
      photoUrl: productModel.photoUrl?.getValue()
    }
  }
}
