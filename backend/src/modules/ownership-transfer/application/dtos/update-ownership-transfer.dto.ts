import { IsDate, IsOptional, IsUUID } from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateOwnershipTransferDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: false
  })
  @IsUUID()
  @IsOptional()
  productId?: UUID

  @ApiProperty({
    description: 'The ID of the from reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: false
  })
  @IsUUID()
  @IsOptional()
  fromResellerId?: UUID

  @ApiProperty({
    description: 'The ID of the to reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: false
  })
  @IsUUID()
  @IsOptional()
  toResellerId?: UUID

  @ApiProperty({
    description: 'The transfer date',
    example: '2021-01-01',
    type: Date,
    required: false
  })
  @IsDate()
  @IsOptional()
  transferDate?: Date
}
