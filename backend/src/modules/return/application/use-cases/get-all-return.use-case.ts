import { Inject, Injectable } from '@nestjs/common'
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'

@Injectable()
export class GetAllReturnUseCase {
  constructor(
    @Inject('ReturnRepository')
    private readonly returnRepository: ReturnRepository
  ) {}

  async execute(user: UserPayload) {
    if (user.role === Role.RESELLER) {
      return await this.returnRepository.findByResellerId(user.id)
    }
    return await this.returnRepository.findAll()
  }
}
