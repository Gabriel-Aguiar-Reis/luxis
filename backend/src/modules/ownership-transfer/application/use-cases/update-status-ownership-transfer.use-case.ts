import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { OwnershipTransferRepository } from '@/modules/ownership-transfer/domain/repositories/ownership-transfer.repository'
import { OwnershipTransferStatusManager } from '@/modules/ownership-transfer/domain/services/ownership-transfer-status-manager.service'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class UpdateStatusOwnershipTransferUseCase {
  constructor(
    @Inject('OwnershipTransferRepository')
    private readonly ownershipTransferRepository: OwnershipTransferRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    id: UUID,
    status: OwnershipTransferStatus
  ): Promise<OwnershipTransfer> {
    let ownershipTransfer = await this.ownershipTransferRepository.findById(id)
    if (!ownershipTransfer) {
      throw new NotFoundException('Ownership transfer not found')
    }

    if (
      !OwnershipTransferStatusManager.canTransition(
        ownershipTransfer.status,
        status
      )
    ) {
      throw new BadRequestException(
        `Invalid status transition: ${ownershipTransfer.status} -> ${status}`
      )
    }

    if (status !== OwnershipTransferStatus.FINISHED) {
      return await this.ownershipTransferRepository.updateStatus(id, status)
    }

    const product = await this.productRepository.findById(
      ownershipTransfer.productId
    )

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    const fromReseller = await this.userRepository.findById(
      ownershipTransfer.fromResellerId
    )

    if (!fromReseller) {
      throw new NotFoundException('FromReseller not found')
    }

    const toReseller = await this.userRepository.findById(
      ownershipTransfer.toResellerId
    )

    if (!toReseller) {
      throw new NotFoundException('ToReseller not found')
    }

    // TODO -> criar o evento que dispará a troca no inventário

    return await this.ownershipTransferRepository.updateStatus(id, status)
  }
}
