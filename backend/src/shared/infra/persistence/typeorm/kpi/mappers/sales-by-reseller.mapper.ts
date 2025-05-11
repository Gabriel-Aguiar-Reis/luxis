import { SalesByResellerDto } from '@/modules/kpi/application/dtos/sales-by-reseller.dto'
import { SalesByReseller } from '@/modules/kpi/domain/entities/sales-by-reseller.entity'

export class SalesByResellerMapper {
  static toDto(entity: SalesByReseller): SalesByResellerDto {
    return {
      resellerId: entity.reseller.id,
      resellerName: entity.reseller.name.getValue(),
      sales: entity.sales,
      totalSales: entity.totalSales.toString(),
      salesCount: entity.sales.length
    }
  }
}
