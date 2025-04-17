import { PackingListStatus } from '@/modules/packing-list/domain/enums/packing-list-status.enum'

export class PackingList {
  constructor(
    public readonly id: string,
    public resellerId: string,
    public readonly createdAt: Date,
    public status: PackingListStatus = PackingListStatus.OPEN,
    public productIds: string[] = []
  ) {}
}
