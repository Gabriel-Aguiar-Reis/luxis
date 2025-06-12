import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { UUID } from 'crypto'
import { Repository } from 'typeorm'
import { SalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/sales-by-reseller.dto'
import { SalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/sales-in-period.dto'
import { TotalSalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-by-reseller.dto'
import { TotalSalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-in-period.dto'
import { TotalBillingReturnDto } from '@/modules/kpi/admin/application/dtos/sale/total-billing-return.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { salesByReseller } from '@/shared/infra/persistence/typeorm/kpi/admin/sale-read-methods/sales-by-reseller'
import { totalSalesByReseller } from '@/shared/infra/persistence/typeorm/kpi/admin/sale-read-methods/total-sales-by-reseller'
import { salesInPeriod } from '@/shared/infra/persistence/typeorm/kpi/admin/sale-read-methods/sales-in-period'
import { totalSalesInPeriod } from '@/shared/infra/persistence/typeorm/kpi/admin/sale-read-methods/total-sales-in-period'
import { totalBillingByBatchId } from '@/shared/infra/persistence/typeorm/kpi/admin/sale-read-methods/total-billing-by-batch-id'
import { totalBillingByResellerId } from '@/shared/infra/persistence/typeorm/kpi/admin/sale-read-methods/total-billing-by-reseller-id'
import { totalBillingByPeriod } from '@/shared/infra/persistence/typeorm/kpi/admin/sale-read-methods/total-billing-by-period'
import { salesByResellerId } from '@/shared/infra/persistence/typeorm/kpi/admin/sale-read-methods/sales-by-reseller-id'

export class SaleReadTypeormRepository implements SaleReadRepository {
  constructor(
    @InjectRepository(SaleTypeOrmEntity)
    private readonly saleRepo: Repository<SaleTypeOrmEntity>,
    @InjectRepository(UserTypeOrmEntity)
    private readonly userRepo: Repository<UserTypeOrmEntity>,
    @InjectRepository(ProductTypeOrmEntity)
    private readonly productRepo: Repository<ProductTypeOrmEntity>
  ) {}

  async salesByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<SalesByResellerDto> {
    return salesByResellerId(
      this.saleRepo,
      this.userRepo,
      this.productRepo,
      resellerId,
      qParams
    )
  }

  async totalSalesByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<TotalSalesByResellerDto> {
    const all = await totalSalesByReseller(this.saleRepo, qParams)
    return (
      all.find((r) => r.resellerId === resellerId) ?? {
        resellerId,
        resellerName: '',
        salesCount: 0
      }
    )
  }

  async salesByReseller(qParams: ParamsDto): Promise<SalesByResellerDto[]> {
    return salesByReseller(this.saleRepo, this.productRepo, qParams)
  }

  async totalSalesByReseller(
    qParams: ParamsDto
  ): Promise<TotalSalesByResellerDto[]> {
    return totalSalesByReseller(this.saleRepo, qParams)
  }

  async salesInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<SalesInPeriodDto> {
    return salesInPeriod(this.saleRepo, this.productRepo, qParams)
  }

  async totalSalesInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalSalesInPeriodDto> {
    return totalSalesInPeriod(this.saleRepo, qParams)
  }

  async totalBillingByBatchId(batchId: UUID): Promise<TotalBillingReturnDto> {
    return totalBillingByBatchId(this.saleRepo, batchId)
  }

  async totalBillingByResellerId(
    resellerId: UUID,
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalBillingReturnDto> {
    return totalBillingByResellerId(this.saleRepo, resellerId, qParams)
  }

  async totalBillingByPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalBillingReturnDto> {
    return totalBillingByPeriod(this.saleRepo, qParams)
  }
}
