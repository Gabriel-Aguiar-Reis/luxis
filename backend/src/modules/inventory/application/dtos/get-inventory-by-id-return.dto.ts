import { InventoryProductIdDto } from "@/modules/inventory/application/dtos/get-inventory-by-id-product-return.dto"
import { ProductModel } from "@/modules/product-model/domain/entities/product-model.entity"
import { ModelName } from "@/modules/product-model/domain/value-objects/model-name.vo"
import { Product } from "@/modules/product/domain/entities/product.entity"
import { ApiProperty } from "@nestjs/swagger"
import { UUID } from "crypto"

export class GetInventoryByIdReturnDto {
    @ApiProperty({
      description: 'The ID of the reseller',
      example: '123e4567-e89b-12d3-a456-426614174000',
      type: String
    })
    resellerId: UUID
  
    @ApiProperty({
      description: 'The full name of the reseller',
      example: 'John Doe',
      type: String
    })
    resellerName: string

    @ApiProperty({
      description: 'The products in the inventory',
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          serialNumber: '0424A-BR-BAB-001',
          modelId: '123e4567-e89b-12d3-a456-426614174000',
          batchId: '123e4567-e89b-12d3-a456-426614174000',
          unitCost: '100.00',
          salePrice: '150.00',
          status: 'IN_STOCK'
        }
      ],
      type: [Product],
    })
    products: Product[]

    @ApiProperty({
      description: 'The Product Models associated with the products in the inventory',
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'iPhone 13 Pro Max',
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
          suggestedPrice: '999.99',
          description: 'Latest iPhone model with advanced features',
          photoUrl: 'https://example.com/iphone13.jpg',
          status: 'ACTIVE'
        }
      ],
      type: [ProductModel]
    })
    productModels: ProductModel[]
  }