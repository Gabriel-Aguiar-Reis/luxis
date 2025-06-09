import { Injectable } from '@nestjs/common'
import { CreateReturnUseCase } from '@/modules/return/application/use-cases/create-return.use-case'
import { UpdateReturnStatusUseCase } from '@/modules/return/application/use-cases/update-return-status.use-case'
import { CreateReturnDto } from '@/modules/return/application/dtos/create-return-dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import * as crypto from 'crypto'
import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'

@Injectable()
export class ReturnSeed {
  constructor(
    private readonly createReturnUseCase: CreateReturnUseCase,
    private readonly updateReturnStatusUseCase: UpdateReturnStatusUseCase
  ) {}

  async run(
    resellerId: crypto.UUID,
    productIds: crypto.UUID[],
    user: UserPayload
  ): Promise<void> {
    const dto: CreateReturnDto = {
      resellerId,
      items: productIds
    }
    const res = await this.createReturnUseCase.execute(dto, user)

    await this.updateReturnStatusUseCase.execute(
      res.id,
      ReturnStatus.APPROVED,
      user
    )

    await this.updateReturnStatusUseCase.execute(
      res.id,
      ReturnStatus.RETURNED,
      user
    )
  }
}
