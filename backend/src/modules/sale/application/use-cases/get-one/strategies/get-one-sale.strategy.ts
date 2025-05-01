import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { UUID } from 'crypto'

export interface GetOneSaleStrategy {
  execute(id: UUID, user: UserPayload): Promise<Sale>
}
