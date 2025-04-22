import { IsDate, IsOptional, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class UpdateOwnershipTransferDto {
  @IsUUID()
  @IsOptional()
  productId: UUID

  @IsUUID()
  @IsOptional()
  fromResellerId: UUID

  @IsUUID()
  @IsOptional()
  toResellerId: UUID

  @IsDate()
  @IsOptional()
  transferDate: Date
}
