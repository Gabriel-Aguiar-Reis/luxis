import { IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateOwnershipTransferDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  productId: UUID

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
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  toResellerId: UUID

  @ApiProperty({
    description: 'The transfer date',
    example: '2023-10-01T12:00:00Z',
    type: Date,
    required: false
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  transferDate?: Date
}
