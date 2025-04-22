import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { PackingList } from '@/modules/packing-list/domain/entities/packing-list.entity'
import { PackingListRepository } from '@/modules/packing-list/domain/repositories/packing-list.repository'
import { UUID } from 'crypto'
import { UpdatePackingListDto } from '@/modules/packing-list/presentation/dtos/update-packing-list.dto'

@Injectable()
export class UpdatePackingListUseCase {
  constructor(
    @Inject('PackingListRepository')
    private readonly packingListRepository: PackingListRepository
  ) {}

  async execute(id: UUID, input: UpdatePackingListDto): Promise<PackingList> {
    let packingList = await this.packingListRepository.findById(id)
    if (!packingList) {
      throw new NotFoundException('Packing list not found')
    }
    packingList = new PackingList(
      packingList.id,
      input.resellerId ?? packingList.resellerId,
      packingList.createdAt,
      input.status ?? packingList.status,
      input.productIds ?? packingList.productIds
    )
    await this.packingListRepository.update(packingList)
    return packingList
  }
}
