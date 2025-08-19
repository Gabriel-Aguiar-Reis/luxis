import { ApiProperty } from '@nestjs/swagger'
import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { UUID } from 'crypto'

export class OwnershipTransferWithSerialDto {
  @ApiProperty({ description: 'The ID of the ownership transfer', type: String })
  id: UUID

  @ApiProperty({ description: 'The ID of the product', type: String })
  productId: UUID

  @ApiProperty({ description: 'The serial number of the product', type: String })
  serialNumber: string

  @ApiProperty({ description: 'The ID of the from reseller', type: String })
  fromResellerId: UUID

  @ApiProperty({ description: 'The name of the from reseller', type: String })
  fromResellerName: string

  @ApiProperty({ description: 'The ID of the to reseller', type: String })
  toResellerId: UUID

  @ApiProperty({ description: 'The name of the from reseller', type: String })
  toResellerName: string
  
  @ApiProperty({ description: 'The transfer date', type: Date })
  transferDate: Date

  @ApiProperty({ description: 'The status of the ownership transfer', enum: OwnershipTransferStatus, type: String })
  status: OwnershipTransferStatus
}
