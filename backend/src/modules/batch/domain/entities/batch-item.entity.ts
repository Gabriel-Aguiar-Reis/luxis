import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Unit } from '@/shared/common/value-object/unit.vo'
import { UUID } from 'crypto'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { ApiProperty } from '@nestjs/swagger'
import { ProductModelStatus } from '@/modules/product-model/domain/enums/product-model-status.enum'

export class BatchItem {
  @ApiProperty({
    description: 'The ID of the batch item',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The ID of the product model',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly modelId: UUID

  @ApiProperty({
    description: 'The quantity of items in the batch',
    example: '10',
    type: String
  })
  public readonly quantity: Unit

  @ApiProperty({
    description: 'The unit cost of the item',
    example: '100.00',
    type: String
  })
  public readonly unitCost: Currency

  @ApiProperty({
    description: 'The sale price of the item',
    example: '150.00',
    type: String
  })
  public readonly salePrice: Currency

  @ApiProperty({
    description: 'The name of the product model',
    example: 'iPhone 13 Pro Max',
    type: String,
    required: false
  })
  public readonly modelName?: ModelName

  @ApiProperty({
    description: 'The ID of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: false
  })
  public readonly categoryId?: UUID

  private constructor(
    id: UUID,
    modelId: UUID,
    quantity: Unit,
    unitCost: Currency,
    salePrice: Currency,
    modelName?: ModelName,
    categoryId?: UUID
  ) {
    this.id = id
    this.modelId = modelId
    this.quantity = quantity
    this.unitCost = unitCost
    this.salePrice = salePrice
    this.modelName = modelName
    this.categoryId = categoryId
  }

  static withExistingModel(
    id: UUID,
    modelId: UUID,
    quantity: Unit,
    unitCost: Currency,
    salePrice: Currency
  ): BatchItem {
    return new BatchItem(id, modelId, quantity, unitCost, salePrice)
  }

  static async withNewModel(
    id: UUID,
    modelName: ModelName,
    categoryId: UUID,
    quantity: Unit,
    unitCost: Currency,
    salePrice: Currency,
    modelRepo: ProductModelRepository
  ): Promise<BatchItem> {
    const productModel = await modelRepo.create(
      new ProductModel(
        crypto.randomUUID(),
        modelName,
        categoryId,
        salePrice,
        ProductModelStatus.USED
      )
    )

    return new BatchItem(id, productModel.id, quantity, unitCost, salePrice)
  }
}
