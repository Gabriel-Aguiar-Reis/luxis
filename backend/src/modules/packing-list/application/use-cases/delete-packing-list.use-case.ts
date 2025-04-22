import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { PackingListRepository } from '@/modules/packing-list/domain/repositories/packing-list.repository'
import { UUID } from 'crypto'

@Injectable()
export class DeletePackingListUseCase {
  constructor(
    @Inject('PackingListRepository')
    private readonly packingListRepository: PackingListRepository
  ) {}

  async execute(id: UUID): Promise<void> {
    let packingList = await this.packingListRepository.findById(id)
    if (!packingList) {
      throw new NotFoundException('Packing list not found')
    }
    return await this.packingListRepository.delete(id)
  }
}
