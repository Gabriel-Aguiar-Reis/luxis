import { BatchItem } from '@/modules/batch/domain/entities/batch-item.entity'
import { UUID } from 'crypto'

export class Batch {
  constructor(
    public readonly id: UUID,
    public arrivalDate: Date,
    public supplierId: UUID,
    public items: BatchItem[] = []
  ) {}
}
