import { ApiProperty } from '@nestjs/swagger'
import { UUID } from 'crypto'

export class ReturnProduct {
  @ApiProperty({
    description: 'The ID of the return product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public productId: UUID
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product Name',
    type: String
  })
  public productModelId: UUID
  @ApiProperty({
    description: 'The name of the product model',
    example: 'Product Model Name',
    type: String
  })
  public productModelName: string
  @ApiProperty({
    description: 'The serial number of the product',
    example: 'SN123456789',
    type: String
  })
  public serialNumber: string
}

export class ReturnWithResellerDto {
  @ApiProperty({
    description: 'The ID of the return',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public id: UUID

  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public resellerId: UUID

  @ApiProperty({
    description: 'The name of the reseller',
    example: 'John Doe',
    type: String
  })
  public resellerName: string

  @ApiProperty({
    description: 'The products in the return',
    type: [ReturnProduct]
  })
  public products: ReturnProduct[]
}
