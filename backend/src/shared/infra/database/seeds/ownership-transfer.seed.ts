import { Injectable } from '@nestjs/common'
import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { CreateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/create-ownership-transfer.use-case'
import { CreateOwnershipTransferDto } from '@/modules/ownership-transfer/application/dtos/create-ownership-transfer.dto'
import * as crypto from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'

@Injectable()
export class OwnershipTransferSeed {
  constructor(
    private readonly createOwnershipTransferUseCase: CreateOwnershipTransferUseCase
  ) {}

  async run(
    productId: crypto.UUID,
    fromResellerId: crypto.UUID,
    toResellerId: crypto.UUID,
    user?: UserPayload
  ): Promise<string> {
    const dto: CreateOwnershipTransferDto = {
      productId,
      fromResellerId,
      toResellerId,
      transferDate: new Date('2024-06-01'),
      status: OwnershipTransferStatus.PENDING
    }
    // Se não passar user, simula um admin
    const userPayload: UserPayload = user || {
      id: fromResellerId,
      email: 'admin@luxis.com',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE
    }
    const transfer = await this.createOwnershipTransferUseCase.execute(
      dto,
      userPayload
    )
    return transfer.id
  }
}
