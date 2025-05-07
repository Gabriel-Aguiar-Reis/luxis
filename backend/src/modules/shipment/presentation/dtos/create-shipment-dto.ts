import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateShipmentDto {
  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  resellerId: UUID

  @ApiProperty({
    description: 'The IDs of the products',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    ],
    type: [String],
    required: true
  })
  @IsArray()
  @ArrayNotEmpty()
  productIds: UUID[] = []
}
