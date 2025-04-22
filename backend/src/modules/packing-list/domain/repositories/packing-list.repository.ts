import { PackingList } from '@/modules/packing-list/domain/entities/packing-list.entity'
import { PackingListStatus } from '@/modules/packing-list/domain/enums/packing-list-status.enum'
import { UUID } from 'crypto'

export abstract class PackingListRepository {
  abstract findAll(): Promise<PackingList[]>
  abstract findById(id: UUID): Promise<PackingList | null>
  abstract create(packingList: PackingList): Promise<PackingList>
  abstract update(packingList: PackingList): Promise<PackingList>
  abstract updateStatus(
    id: UUID,
    status: PackingListStatus
  ): Promise<PackingList>
  abstract delete(id: UUID): Promise<void>
}
