import { UpdateOwnershipTransferStatusDto } from '@/modules/ownership-transfer/application/dtos/update-ownership-transfer-status.dto'
import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { OwnershipTransferDispatchedEvent } from '@/modules/ownership-transfer/domain/events/ownership-transfer-dispatcher.event'
import { OwnershipTransferRepository } from '@/modules/ownership-transfer/domain/repositories/ownership-transfer.repository'
import { OwnershipTransferStatusManager } from '@/modules/ownership-transfer/domain/services/ownership-transfer-status-manager.service'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
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
    private readonly userRepository: UserRepository,
    private readonly eventDispatcher: EventDispatcher
  ) {}

  async execute(
    id: UUID,
    dto: UpdateOwnershipTransferStatusDto,
    user: UserPayload
  ): Promise<OwnershipTransfer> {
    let ownershipTransfer = await this.ownershipTransferRepository.findById(id)
    if (!ownershipTransfer) {
      throw new NotFoundException('Ownership transfer not found')
    }

    if (
      !OwnershipTransferStatusManager.canTransition(
        ownershipTransfer.status,
        dto.status
      )
    ) {
      console.log(dto)
      throw new BadRequestException(
        `Invalid status transition: ${ownershipTransfer.status} -> ${dto.status}`
      )
    }
 
    if (dto.status !== OwnershipTransferStatus.FINISHED) {
      return await this.ownershipTransferRepository.updateStatus(id, dto.status)
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

    await this.eventDispatcher.dispatch(
      new OwnershipTransferDispatchedEvent(
        fromReseller.id,
        toReseller.id,
        product.id,
        user
      )
    )

    return await this.ownershipTransferRepository.updateStatus(id, dto.status)
  }
}
