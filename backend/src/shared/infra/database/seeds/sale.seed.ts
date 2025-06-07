import { Injectable, Inject } from '@nestjs/common'
import { CreateSaleUseCase } from '@/modules/sale/application/use-cases/create/create-sale.use-case'
import { CreateSaleDto } from '@/modules/sale/application/dtos/create-sale.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { UUID } from 'crypto'

@Injectable()
export class SaleSeed {
  constructor(private readonly createSaleUseCase: CreateSaleUseCase) {}

  async run(
    customerId: UUID,
    productIds: UUID[],
    user: UserPayload
  ): Promise<UUID> {
    const dto: CreateSaleDto = {
      customerId,
      productIds,
      saleDate: new Date('2024-06-01'),
      paymentMethod: PaymentMethod.CASH,
      numberInstallments: 1,
      installmentsInterval: 0
    }
    const sale = await this.createSaleUseCase.execute(dto, user)
    return sale.id
  }
}
