import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { PackingList } from '@/modules/packing-list/domain/entities/packing-list.entity'
import { PackingListRepository } from '@/modules/packing-list/domain/repositories/packing-list.repository'
import { UUID } from 'crypto'

@Injectable()
export class GetOnePackingListUseCase {
  constructor(
    @Inject('PackingListRepository')
    private readonly packingListRepository: PackingListRepository
  ) {}

  async execute(id: UUID): Promise<PackingList> {
    let packingList = await this.packingListRepository.findById(id)
    if (!packingList) {
      throw new NotFoundException('Packing list not found')
    }
    return packingList
  }
}
