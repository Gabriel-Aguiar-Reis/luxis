import { ModelName } from "@/modules/product-model/domain/value-objects/model-name.vo"
import { SerialNumber } from "@/modules/product/domain/value-objects/serial-number.vo"
import { ApiProperty } from "@nestjs/swagger"
import { UUID } from "crypto"

export class ReturnProductDto {
  @ApiProperty({
    description: 'The ID of the product being returned',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  productId: UUID

  @ApiProperty({
    description: 'The reason for the return',
    example: 'Defective item',
    type: ModelName
  })
  productModelName: ModelName

  @ApiProperty({
    description: 'The serial number of the product being returned',
    example: 'SN123456',
    type: SerialNumber
  })
  serialNumber: SerialNumber
}