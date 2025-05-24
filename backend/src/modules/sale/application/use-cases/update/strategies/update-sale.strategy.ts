import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { UpdateSaleDto } from '@/modules/sale/application/dtos/update-sale.dto'
import { UUID } from 'crypto'

export interface UpdateSaleStrategy {
  execute(id: UUID, dto: UpdateSaleDto, user: UserPayload): Promise<Sale>
}
