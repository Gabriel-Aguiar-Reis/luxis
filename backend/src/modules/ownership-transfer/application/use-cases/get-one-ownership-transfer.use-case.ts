import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferRepository } from '@/modules/ownership-transfer/domain/repositories/ownership-transfer.repository'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetOneOwnershipTransferUseCase {
  constructor(
    @Inject('OwnershipTransferRepository')
    private readonly ownershipTransferRepository: OwnershipTransferRepository
  ) {}

  async execute(id: UUID): Promise<OwnershipTransfer> {
    let ownershipTransfer = await this.ownershipTransferRepository.findById(id)
    if (!ownershipTransfer) {
      throw new NotFoundException('Ownership transfer not found')
    }
    return ownershipTransfer
  }
}
