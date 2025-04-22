import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { OwnershipTransferRepository } from '@/modules/ownership-transfer/domain/repositories/ownership-transfer.repository'
import { CreateOwnershipTransferDto } from '@/modules/ownership-transfer/presentation/dtos/create-ownership-transfer.dto'
import { Injectable, Inject } from '@nestjs/common'
import * as crypto from 'crypto'

@Injectable()
export class CreateOwnershipTransferUseCase {
  constructor(
    @Inject('OwnershipTransferRepository')
    private readonly ownershipTransferRepository: OwnershipTransferRepository
  ) {}

  async execute(input: CreateOwnershipTransferDto): Promise<OwnershipTransfer> {
    const ownershipTransfer = new OwnershipTransfer(
      crypto.randomUUID(),
      input.productId,
      input.fromResellerId,
      input.toResellerId,
      new Date(),
      OwnershipTransferStatus.PENDING
    )

    return await this.ownershipTransferRepository.create(ownershipTransfer)
  }
}
