import { Injectable, Inject } from '@nestjs/common'
import { CreateReturnUseCase } from '@/modules/return/application/use-cases/create-return.use-case'
import { CreateReturnDto } from '@/modules/return/application/dtos/create-return-dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import * as crypto from 'crypto'

@Injectable()
export class ReturnSeed {
  constructor(private readonly createReturnUseCase: CreateReturnUseCase) {}

  async run(
    resellerId: crypto.UUID,
    productIds: crypto.UUID[],
    user: UserPayload
  ): Promise<string> {
    const dto: CreateReturnDto = {
      resellerId,
      items: productIds
    }
    await this.createReturnUseCase.execute(dto, user)
    return ''
  }
}
