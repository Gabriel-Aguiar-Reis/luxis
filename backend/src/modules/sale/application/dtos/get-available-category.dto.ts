import { CategoryName } from '@/modules/category/domain/value-objects/category-name.vo'
import { GetAvailableProductModelDto } from '@/modules/sale/application/dtos/get-available-product-model.dto'
import { ApiProperty } from '@nestjs/swagger'
import { UUID } from 'crypto'

export class GetAvailableCategoryDto {
  @ApiProperty({
    description: 'The ID of the category',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    type: String,
    required: true
  })
  categoryId: UUID

  @ApiProperty({
    description: 'The name of the category',
    example: 'Smartphones',
    type: CategoryName,
    required: true
  })
  categoryName: CategoryName

  @ApiProperty({
    description: 'The available product models',
    type: [GetAvailableProductModelDto],
    required: true
  })
  models: GetAvailableProductModelDto[]
}
