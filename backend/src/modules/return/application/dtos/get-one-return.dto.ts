import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'
import { ReturnProductDto } from '@/modules/return/application/dtos/return-product.dto'

export class GetOneReturnDto {
  @ApiProperty({
    description: 'The ID of the return',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  id: UUID

  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  resellerId: UUID

  @ApiProperty({
    description: 'The name of the reseller',
    example: 'Reseller XYZ',
    type: String
  })
  resellerName: string

  @ApiProperty({
    description: 'The IDs of the products being returned',
    example: [
      {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        productModelName: 'Model XYZ'
      },
      {
        productId: '123e4567-e89b-12d3-a456-426614174001',
        productModelName: 'Model ABC'
      }
    ],
    type: [ReturnProductDto]
  })
  products: ReturnProductDto[]

  @ApiProperty({
    description: 'The status of the return',
    enum: ReturnStatus,
    example: ReturnStatus.PENDING,
    type: String
  })
  status: ReturnStatus

  @ApiProperty({
    description: 'The creation date of the return',
    example: '2024-01-01',
    type: Date
  })
  createdAt: Date
}
