import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class CreateOwnershipTransferDto {
  @IsUUID()
  @IsNotEmpty()
  productId: UUID

  @IsUUID()
  @IsNotEmpty()
  fromResellerId: UUID

  @IsUUID()
  @IsNotEmpty()
  toResellerId: UUID

  @IsString()
  @IsNotEmpty()
  transferDate: Date

  @IsEnum(OwnershipTransferStatus)
  @IsNotEmpty()
  status: OwnershipTransferStatus
}
