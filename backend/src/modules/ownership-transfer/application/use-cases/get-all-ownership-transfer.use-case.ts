import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferRepository } from '@/modules/ownership-transfer/domain/repositories/ownership-transfer.repository'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class GetAllOwnershipTransferUseCase {
  constructor(
    @Inject('OwnershipTransferRepository')
    private readonly ownershipTransferRepository: OwnershipTransferRepository
  ) {}

  async execute(): Promise<OwnershipTransfer[]> {
    return await this.ownershipTransferRepository.findAll()
  }
}
