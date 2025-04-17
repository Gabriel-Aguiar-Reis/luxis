import { PackingListStatus } from '@/modules/packing-list/domain/enums/packing-list-status.enum'
import { UUID } from 'crypto'

export class PackingList {
  constructor(
    public readonly id: UUID,
    public resellerId: UUID,
    public readonly createdAt: Date,
    public status: PackingListStatus = PackingListStatus.OPEN,
    public productIds: UUID[] = []
  ) {}
}
