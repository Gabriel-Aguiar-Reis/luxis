import { BatchItem } from '@/modules/batch/domain/entities/batch-item.entity'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class Batch {
  @ApiProperty({
    description: 'The ID of the batch',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The arrival date of the batch',
    example: '2024-01-01',
    type: Date
  })
  public arrivalDate: Date

  @ApiProperty({
    description: 'The ID of the supplier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public supplierId: UUID

  @ApiProperty({
    description: 'The items in the batch',
    type: [BatchItem]
  })
  public items: BatchItem[]

  constructor(
    id: UUID,
    arrivalDate: Date,
    supplierId: UUID,
    items: BatchItem[] = []
  ) {
    this.id = id
    this.arrivalDate = arrivalDate
    this.supplierId = supplierId
    this.items = items
  }
}
