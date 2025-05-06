import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class Return {
  @ApiProperty({
    description: 'The ID of the return',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly resellerId: UUID

  @ApiProperty({
    description: 'The IDs of the products being returned',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    ],
    type: [String]
  })
  public readonly items: UUID[]

  @ApiProperty({
    description: 'The status of the return',
    enum: ReturnStatus,
    example: ReturnStatus.PENDING,
    type: String
  })
  public readonly status: ReturnStatus

  @ApiProperty({
    description: 'The creation date of the return',
    example: '2024-01-01',
    type: Date
  })
  public readonly createdAt: Date

  constructor(
    id: UUID,
    resellerId: UUID,
    items: UUID[],
    status: ReturnStatus,
    createdAt: Date
  ) {
    this.id = id
    this.resellerId = resellerId
    this.items = items
    this.status = status
    this.createdAt = createdAt
  }
}
