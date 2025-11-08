import { GetAvailableCategoryDto } from '@/modules/sale/application/dtos/get-available-category.dto'
import { ApiProperty } from '@nestjs/swagger'

export class GetAvailableProductsToSellDto {
  @ApiProperty({
    description:
      'The available categories with their product models and products',
    type: [GetAvailableCategoryDto],
    required: true
  })
  data: GetAvailableCategoryDto[]
}
