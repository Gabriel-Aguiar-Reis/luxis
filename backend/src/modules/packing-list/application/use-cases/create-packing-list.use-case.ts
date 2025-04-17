import { Inject, Injectable } from '@nestjs/common'
import * as crypto from 'crypto'

import { PackingList } from '@/modules/packing-list/domain/entities/packing-list.entity'
import { PackingListRepository } from '@/modules/packing-list/domain/repositories/packing-list.repository'
import { CreatePackingListDto } from '@/modules/packing-list/presentation/dtos/create-packing-list.dto'
import { PackingListStatus } from '@/modules/packing-list/domain/enums/packing-list-status.enum'

@Injectable()
export class CreatePackingListUseCase {
  constructor(
    @Inject('PackingListRepository')
    private readonly packingListRepo: PackingListRepository
  ) {}

  async execute(input: CreatePackingListDto): Promise<PackingList> {
    const packingList = new PackingList(
      crypto.randomUUID(),
      input.resellerId,
      new Date(),
      PackingListStatus.OPEN,
      input.productIds
    )
    return await this.packingListRepo.create(packingList)
  }
}
