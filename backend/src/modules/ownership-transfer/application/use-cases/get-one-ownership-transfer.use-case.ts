import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferRepository } from '@/modules/ownership-transfer/domain/repositories/ownership-transfer.repository'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetOneOwnershipTransferUseCase {
  constructor(
    @Inject('OwnershipTransferRepository')
    private readonly ownershipTransferRepository: OwnershipTransferRepository
  ) {}

  async execute(id: UUID, user: UserPayload): Promise<OwnershipTransfer> {
    let ownershipTransfer = await this.ownershipTransferRepository.findById(id)
    if (!ownershipTransfer) {
      throw new NotFoundException('Ownership transfer not found')
    }

    if (user.role === Role.RESELLER) {
      if (
        ownershipTransfer.fromResellerId !== user.id ||
        ownershipTransfer.toResellerId !== user.id
      ) {
        throw new ForbiddenException(
          'You are not allowed to access this resource'
        )
      }
    }
    return ownershipTransfer
  }
}
