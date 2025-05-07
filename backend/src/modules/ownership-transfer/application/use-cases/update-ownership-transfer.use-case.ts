import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferRepository } from '@/modules/ownership-transfer/domain/repositories/ownership-transfer.repository'
import { UpdateOwnershipTransferDto } from '@/modules/ownership-transfer/presentation/dtos/update-ownership-transfer.dto'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class UpdateOwnershipTransferUseCase {
  constructor(
    @Inject('OwnershipTransferRepository')
    private readonly ownershipTransferRepository: OwnershipTransferRepository
  ) {}

  async execute(
    id: UUID,
    input: UpdateOwnershipTransferDto
  ): Promise<OwnershipTransfer> {
    let ownershipTransfer = await this.ownershipTransferRepository.findById(id)
    if (!ownershipTransfer) {
      throw new NotFoundException('Ownership transfer not found')
    }
    ownershipTransfer = new OwnershipTransfer(
      ownershipTransfer.id,
      input.productId ?? ownershipTransfer.productId,
      input.fromResellerId ?? ownershipTransfer.fromResellerId,
      input.toResellerId ?? ownershipTransfer.toResellerId,
      input.transferDate ?? ownershipTransfer.transferDate,
      ownershipTransfer.status
    )
    return await this.ownershipTransferRepository.update(ownershipTransfer)
  }
}
