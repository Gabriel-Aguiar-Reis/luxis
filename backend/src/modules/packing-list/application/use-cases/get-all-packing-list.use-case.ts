import { Inject, Injectable } from '@nestjs/common'

import { PackingList } from '@/modules/packing-list/domain/entities/packing-list.entity'
import { PackingListRepository } from '@/modules/packing-list/domain/repositories/packing-list.repository'

@Injectable()
export class GetAllPackingListUseCase {
  constructor(
    @Inject('PackingListRepository')
    private readonly packingListRepository: PackingListRepository
  ) {}

  async execute(): Promise<PackingList[]> {
    return await this.packingListRepository.findAll()
  }
}
