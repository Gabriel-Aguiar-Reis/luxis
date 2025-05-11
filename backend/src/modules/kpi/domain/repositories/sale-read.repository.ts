import { SalesByReseller } from '@/modules/kpi/domain/entities/sales-by-reseller.entity'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { UUID } from 'crypto'

export abstract class SaleReadRepository {
  abstract totalSalesByResellerId(resellerId: UUID): Promise<SalesByReseller>
  // abstract totalSalesInPeriod(start: Date, end: Date): Promise<Sale[]>
  // abstract topSellers(
  //   limit: number
  // ): Promise<{ resellerId: UUID; total: number }[]>
}
