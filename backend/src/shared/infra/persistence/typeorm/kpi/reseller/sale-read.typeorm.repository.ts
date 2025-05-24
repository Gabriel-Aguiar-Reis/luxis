import { Injectable } from '@nestjs/common'
import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { SaleReadRepository } from '@/modules/kpi/reseller/domain/repositories/sale-read.repository'
import { MonthlySalesDto } from '@/modules/kpi/reseller/application/dtos/sale/monthly-sales.dto'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { Repository } from 'typeorm'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class SaleReadTypeormRepository implements SaleReadRepository {
  constructor(
    @InjectRepository(SaleTypeOrmEntity)
    private readonly saleRepo: Repository<SaleTypeOrmEntity>
  ) {}

  async monthlySales(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<MonthlySalesDto[]> {
    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .where('sale.reseller_id = :resellerId', { resellerId })

    const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')

    const sales = await filteredSales.getMany()

    const monthlySales = sales.reduce(
      (acc, sale) => {
        const month = sale.saleDate.getMonth()
        if (!acc[month]) {
          acc[month] = {
            month,
            countSales: 0,
            totalAmount: '0'
          }
        }
        acc[month].countSales++
        acc[month].totalAmount = (
          Number(acc[month].totalAmount) + Number(sale.totalAmount)
        ).toString()
        return acc
      },
      {} as Record<number, MonthlySalesDto>
    )

    return Object.values(monthlySales)
  }

  async averageTicket(resellerId: UUID, qParams: ParamsDto): Promise<number> {
    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .where('sale.reseller_id = :resellerId', { resellerId })

    const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')

    const sales = await filteredSales.getMany()

    const totalAmount = sales.reduce((acc, sale) => {
      return acc + Number(sale.totalAmount)
    }, 0)

    return totalAmount / sales.length
  }
}
