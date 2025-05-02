import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class CreateOwnershipTransferDto {
  @IsUUID()
  @IsNotEmpty()
  productId: UUID

  @IsUUID()
  @IsOptional()
  fromResellerId: UUID

  @IsUUID()
  @IsNotEmpty()
  toResellerId: UUID

  @IsDate()
  @IsNotEmpty()
  transferDate: Date

  @IsEnum(OwnershipTransferStatus)
  @IsNotEmpty()
  status: OwnershipTransferStatus
}
