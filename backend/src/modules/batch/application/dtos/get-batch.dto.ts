import { GetBatchProductDto } from "@/modules/batch/application/dtos/get-batch-product.dto"
import { Currency } from "@/shared/common/value-object/currency.vo"
import { ApiProperty } from "@nestjs/swagger"
import { UUID } from "crypto"

export class GetBatchDto {
  @ApiProperty({
    description: 'The arrival date of the batch',
    example: '2023-10-01T00:00:00.000Z',
    type: Date
  })
  arrivalDate: Date

  @ApiProperty({
    description: 'The supplier ID of the batch',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String
  })
  supplierId: UUID

  @ApiProperty({
    description: 'The ID of the batch',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String
  })
  id: UUID

  @ApiProperty({
    description: 'The supplier name of the batch',
    example: 'Supplier Inc.',
    type: String
  })
  supplierName: string

  @ApiProperty({
    description: 'The total number of items in the batch',
    example: 150,
    type: Number
  })
  totalItems: number

  @ApiProperty({
    description: 'The total cost of the batch',
    example: '1500.00',
    type: Currency
  })
  totalCost: Currency

  @ApiProperty({
    description: 'The items in the batch',
    type: [GetBatchProductDto]
  })
  items: GetBatchProductDto[]
}