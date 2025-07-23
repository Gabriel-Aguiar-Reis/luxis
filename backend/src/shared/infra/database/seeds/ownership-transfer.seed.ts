import { Injectable } from '@nestjs/common'
import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { CreateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/create-ownership-transfer.use-case'
import { CreateOwnershipTransferDto } from '@/modules/ownership-transfer/application/dtos/create-ownership-transfer.dto'
import * as crypto from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { UpdateStatusOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/update-status-ownership-transfer.use-case'

@Injectable()
export class OwnershipTransferSeed {
  constructor(
    private readonly createOwnershipTransferUseCase: CreateOwnershipTransferUseCase,
    private readonly updateStatusOwnershipTransferUseCase: UpdateStatusOwnershipTransferUseCase
  ) {}

  async run(
    productId: crypto.UUID,
    fromResellerId: crypto.UUID,
    toResellerId: crypto.UUID,
    user: UserPayload
  ): Promise<string> {
    const dto: CreateOwnershipTransferDto = {
      productId,
      fromResellerId,
      toResellerId,
      transferDate: new Date('2024-06-01'),
      status: OwnershipTransferStatus.PENDING
    }
    const transfer = await this.createOwnershipTransferUseCase.execute(
      dto,
      user
    )

    await this.updateStatusOwnershipTransferUseCase.execute(
      transfer.id,
      OwnershipTransferStatus.APPROVED,
      user
    )

    await this.updateStatusOwnershipTransferUseCase.execute(
      transfer.id,
      OwnershipTransferStatus.FINISHED,
      user
    )
    return transfer.id
  }
}
