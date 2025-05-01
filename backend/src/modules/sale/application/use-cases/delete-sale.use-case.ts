import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class DeleteSaleUseCase {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(id: UUID, user: UserPayload): Promise<void> {
    const sale = await this.saleRepository.findById(id)
    if (!sale) {
      throw new NotFoundException('Sale not found')
    }

    if (user.role === Role.ADMIN) {
      return await this.saleRepository.delete(id)
    }

    if (sale.resellerId !== user.id) {
      throw new Error('You are not authorized to delete this sale')
    }

    return await this.saleRepository.delete(id)
  }
}
