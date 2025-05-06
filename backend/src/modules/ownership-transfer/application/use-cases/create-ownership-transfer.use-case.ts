import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { OwnershipTransferRepository } from '@/modules/ownership-transfer/domain/repositories/ownership-transfer.repository'
import { CreateOwnershipTransferDto } from '@/modules/ownership-transfer/presentation/dtos/create-ownership-transfer.dto'
import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import * as crypto from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
@Injectable()
export class CreateOwnershipTransferUseCase {
  constructor(
    @Inject('OwnershipTransferRepository')
    private readonly ownershipTransferRepository: OwnershipTransferRepository
  ) {}

  async execute(
    input: CreateOwnershipTransferDto,
    user: UserPayload
  ): Promise<OwnershipTransfer> {
    let ownershipTransfer: OwnershipTransfer
    if (!input.fromResellerId) {
      throw new BadRequestException('From reseller ID is required')
    }
    if (user.role === Role.RESELLER) {
      ownershipTransfer = new OwnershipTransfer(
        crypto.randomUUID(),
        input.productId,
        user.id,
        input.toResellerId,
        new Date(),
        OwnershipTransferStatus.PENDING
      )
    } else {
      ownershipTransfer = new OwnershipTransfer(
        crypto.randomUUID(),
        input.productId,
        input.fromResellerId,
        input.toResellerId,
        new Date(),
        OwnershipTransferStatus.PENDING
      )
    }

    return await this.ownershipTransferRepository.create(ownershipTransfer)
  }
}
