import { CreateSaleDto } from '@/modules/sale/application/dtos/create-sale.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'

export interface CreateSaleStrategy {
  execute(dto: CreateSaleDto, user: UserPayload): Promise<Sale>
}
