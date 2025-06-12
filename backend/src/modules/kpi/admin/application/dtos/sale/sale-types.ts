// Tipos e interfaces usados no SaleReadTypeormRepository
import { UUID } from 'crypto'

export type SaleByResellerIdReturnRawResult = {
  id: UUID
  saleDate: Date
  totalAmount: string
  paymentMethod: string
  numberInstallments: number
  status: string
  productIds: UUID[]
  customerId: UUID
  customerName: string
  customerPhone: string
}

export type SaleReturnRawResult = SaleByResellerIdReturnRawResult & {
  resellerId: UUID
  resellerName: string
  resellerPhone: string
}
