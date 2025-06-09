import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { Return } from '@/modules/return/domain/entities/return.entity'
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository'
import { CreateReturnDto } from '@/modules/return/application/dtos/create-return-dto'
import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
@Injectable()
export class CreateReturnUseCase {
  constructor(
    @Inject('ReturnRepository')
    private readonly returnRepository: ReturnRepository
  ) {}

  async execute(input: CreateReturnDto, user: UserPayload): Promise<Return> {
    let returnEntity: Return
    if (user.role === Role.RESELLER) {
      returnEntity = new Return(
        crypto.randomUUID(),
        user.id,
        input.items,
        ReturnStatus.PENDING,
        new Date()
      )
      return await this.returnRepository.create(returnEntity)
    }

    if (!input.resellerId) {
      throw new BadRequestException('Reseller ID is required')
    }

    returnEntity = new Return(
      crypto.randomUUID(),
      input.resellerId,
      input.items,
      ReturnStatus.PENDING,
      new Date()
    )

    return await this.returnRepository.create(returnEntity)
  }
}
