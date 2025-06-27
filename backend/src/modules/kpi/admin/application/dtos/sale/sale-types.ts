import { UUID } from 'crypto'

export type SaleByResellerIdReturnRawResult = {
  id: UUID
  saleDate: Date
  totalAmount: string
  paymentMethod: string
  numberInstallments: number
  installmentsInterval: number
  installmentsPaid: number
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
