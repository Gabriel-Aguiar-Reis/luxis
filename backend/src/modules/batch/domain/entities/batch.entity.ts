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
    example: '2023-10-01T12:00:00Z',
    type: Date
  })
  public arrivalDate: Date

  @ApiProperty({
    description: 'The ID of the supplier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public supplierId: UUID

  constructor(id: UUID, arrivalDate: Date, supplierId: UUID) {
    this.id = id
    this.arrivalDate = arrivalDate
    this.supplierId = supplierId
  }
}
