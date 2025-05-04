import { IsNotEmpty, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class TransferCustomerDto {
  @IsUUID()
  @IsNotEmpty()
  fromResellerId: UUID

  @IsUUID()
  @IsNotEmpty()
  toResellerId: UUID
}
