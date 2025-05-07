import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class GetAllSaleUseCase {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(user: UserPayload): Promise<Sale[]> {
    if (user.role === Role.RESELLER) {
      return this.saleRepository.findByResellerId(user.id)
    }

    return this.saleRepository.findAll()
  }
}
