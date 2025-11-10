import { ModelName } from "@/modules/product-model/domain/value-objects/model-name.vo"
import { SerialNumber } from "@/modules/product/domain/value-objects/serial-number.vo"
import { Currency } from "@/shared/common/value-object/currency.vo"
import { ApiProperty } from "@nestjs/swagger"
import { UUID } from "crypto"

export class ShipmentProductDto {
  @ApiProperty({
    description: 'The ID of the product',
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
    description: 'The name of the product model',
    example: 'Product Model Name',
    type: ModelName
  })
  public readonly modelName: ModelName
  @ApiProperty({
    description: 'The serial number of the product',
    example: 'SN123456789',
    type: SerialNumber
  })
  public readonly serialNumber: SerialNumber
  @ApiProperty({
    description: 'The sale price of the product',
    example: '100.00',
    type: Currency
  })
  public readonly salePrice: Currency
}