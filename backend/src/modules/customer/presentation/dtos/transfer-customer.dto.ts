import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class TransferCustomerDto {
  @ApiProperty({
    description: 'The ID of the from reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  @IsUUID()
  @IsNotEmpty()
  fromResellerId: UUID

  @ApiProperty({
    description: 'The ID of the to reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  @IsUUID()
  @IsNotEmpty()
  toResellerId: UUID
}
