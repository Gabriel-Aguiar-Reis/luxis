import { ApiProperty } from '@nestjs/swagger'
import { InventoryProductDto } from '@/modules/kpi/reseller/application/dtos/inventory/inventory-product.dto'

export class InventoryProductModelDto {
  @ApiProperty({
    description: 'The ID of the product model',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public modelId: string

  @ApiProperty({
    description: 'The name of the product model',
    example: 'iPhone 13 Pro Max',
    type: String
  })
  public modelName: string

  @ApiProperty({
    description: 'The quantity of the product model',
    example: 10,
    type: Number
  })
  public quantity: number

  @ApiProperty({
    description: 'The products of the product model',
    type: [InventoryProductDto]
  })
  public products: InventoryProductDto[]
}
