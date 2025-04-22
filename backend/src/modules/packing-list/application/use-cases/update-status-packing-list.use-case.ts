import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { PackingList } from '@/modules/packing-list/domain/entities/packing-list.entity'
import { PackingListRepository } from '@/modules/packing-list/domain/repositories/packing-list.repository'
import { UUID } from 'crypto'
import { PackingListStatus } from '@/modules/packing-list/domain/enums/packing-list-status.enum'

@Injectable()
export class UpdateStatusPackingListUseCase {
  constructor(
    @Inject('PackingListRepository')
    private readonly packingListRepository: PackingListRepository
  ) {}

  async execute(id: UUID, status: PackingListStatus): Promise<PackingList> {
    let packingList = await this.packingListRepository.findById(id)
    if (!packingList) {
      throw new NotFoundException('Packing list not found')
    }
    return await this.packingListRepository.updateStatus(id, status)
  }
}
