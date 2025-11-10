import { SerialNumber } from "@/modules/product/domain/value-objects/serial-number.vo";
import { Currency } from "@/shared/common/value-object/currency.vo";
import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";

export class InventoryProductIdDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: UUID

  @ApiProperty({
    description: 'The model ID of the product',
    example: 'model-1',
    type: String,
  })
  modelId: UUID

  @ApiProperty({
    description: 'The serial number of the product',
    example: 'SN-123456',
    type: SerialNumber,
  })
  serialNumber: SerialNumber

    @ApiProperty({
      description: 'The sale price of the product',
      example: '150.00',
      type: Currency
    })
    public salePrice: Currency
}
