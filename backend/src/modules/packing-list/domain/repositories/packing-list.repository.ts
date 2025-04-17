import { PackingList } from '@/modules/packing-list/domain/entities/packing-list.entity'

export abstract class PackingListRepository {
  abstract findAll(): Promise<PackingList[]>
  abstract findById(id: string): Promise<PackingList | null>
  abstract create(packingList: PackingList): Promise<PackingList>
  abstract update(packingList: PackingList): Promise<PackingList>
  abstract updateStatus(id: string, status: string): Promise<PackingList>
  abstract delete(id: string): Promise<void>
}
