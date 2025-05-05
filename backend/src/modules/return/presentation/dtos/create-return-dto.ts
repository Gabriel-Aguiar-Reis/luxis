import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator'
import { IsUUID } from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateReturnDto {
  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: false
  })
  @IsUUID()
  @IsOptional()
  resellerId: UUID

  @ApiProperty({
    description: 'The IDs of the items',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    ],
    type: [String],
    required: false
  })
  @IsArray()
  @ArrayNotEmpty()
  items: UUID[]
}
