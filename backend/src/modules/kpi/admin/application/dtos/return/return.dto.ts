import { ApiProperty } from '@nestjs/swagger'
import { UUID } from 'crypto'

export class ReturnProduct {
  public productId: UUID
  public productModelId: UUID
  public productModelName: string
}

export class ReturnDto {
  @ApiProperty({
    description: 'The ID of the return',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public id: UUID

  @ApiProperty({
    description: 'The products in the return',
    type: [ReturnProduct]
  })
  public products: ReturnProduct[]
}
