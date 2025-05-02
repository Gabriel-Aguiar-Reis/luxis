import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferRepository } from '@/modules/ownership-transfer/domain/repositories/ownership-transfer.repository'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class GetAllOwnershipTransferUseCase {
  constructor(
    @Inject('OwnershipTransferRepository')
    private readonly ownershipTransferRepository: OwnershipTransferRepository
  ) {}

  async execute(user: UserPayload): Promise<OwnershipTransfer[]> {
    if (user.role === Role.ADMIN || user.role === Role.ASSISTANT) {
      return await this.ownershipTransferRepository.findAll()
    }

    return await this.ownershipTransferRepository.findAllByResellerId(user.id)
  }
}
