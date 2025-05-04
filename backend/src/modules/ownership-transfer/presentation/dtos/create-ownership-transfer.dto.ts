import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateOwnershipTransferDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  @IsUUID()
  @IsNotEmpty()
  productId: UUID

  @ApiProperty({
    description: 'The ID of the from reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  @IsUUID()
  @IsOptional()
  fromResellerId: UUID

  @ApiProperty({
    description: 'The ID of the to reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  @IsUUID()
  @IsNotEmpty()
  toResellerId: UUID

  @ApiProperty({
    description: 'The transfer date',
    example: '2021-01-01',
    type: Date
  })
  @IsDate()
  @IsNotEmpty()
  transferDate: Date

  @ApiProperty({
    description: 'The status of the ownership transfer',
    example: OwnershipTransferStatus.PENDING,
    type: OwnershipTransferStatus,
    enumName: 'OwnershipTransferStatus'
  })
  @IsEnum(OwnershipTransferStatus)
  @IsNotEmpty()
  status: OwnershipTransferStatus
}
