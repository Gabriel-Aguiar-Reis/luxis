import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class OwnershipTransfer {
  @ApiProperty({
    description: 'The ID of the ownership transfer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The ID of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public productId: UUID

  @ApiProperty({
    description: 'The ID of the from reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public fromResellerId: UUID

  @ApiProperty({
    description: 'The ID of the to reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public toResellerId: UUID

  @ApiProperty({
    description: 'The transfer date',
    example: '2021-01-01',
    type: Date
  })
  public transferDate: Date

  @ApiProperty({
    description: 'The status of the ownership transfer',
    enum: OwnershipTransferStatus,
    example: OwnershipTransferStatus.PENDING,
    type: String
  })
  public status: OwnershipTransferStatus

  constructor(
    id: UUID,
    productId: UUID,
    fromResellerId: UUID,
    toResellerId: UUID,
    transferDate: Date,
    status: OwnershipTransferStatus = OwnershipTransferStatus.PENDING
  ) {
    this.id = id
    this.productId = productId
    this.fromResellerId = fromResellerId
    this.toResellerId = toResellerId
    this.transferDate = transferDate
    this.status = status
  }
}
