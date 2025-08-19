import { InventoryProductIdDto } from "@/modules/inventory/application/dtos/get-inventory-by-id-product-return.dto"
import { ModelName } from "@/modules/product-model/domain/value-objects/model-name.vo"
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
      description: 'The IDs of the products in the inventory',
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          modelId: 'model-1',
          serialNumber: 'SN-123456'
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          modelId: 'model-2',
          serialNumber: 'SN-123457'
        }
      ],
      type: [InventoryProductIdDto],
    })
    products: InventoryProductIdDto[]

    @ApiProperty({
      description: 'The model names of the products in the inventory',
      example: ['model-1', 'model-2'],
      type: [ModelName]
    })
    productModelNames: ModelName[]
  }