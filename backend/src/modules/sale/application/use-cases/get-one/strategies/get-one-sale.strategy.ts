import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { UUID } from 'crypto'
import { GetSaleDto } from '@/modules/sale/application/dtos/get-sale.dto'

export interface GetOneSaleStrategy {
  execute(id: UUID, user: UserPayload): Promise<GetSaleDto>
}
