import { ReturnByResellerDto } from '@/modules/kpi/admin/application/dtos/return/return-by-reseller.dto'
import { ReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/returns-in-period.dto'
import { TotalReturnsByResellerDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-by-reseller.dto'
import { TotalReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-in-period.dto'
import { ReturnReadRepository } from '@/modules/kpi/admin/domain/repositories/return-read.repository'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { UUID } from 'crypto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { returnsByResellerId } from '@/shared/infra/persistence/typeorm/kpi/admin/return-read-methods/returns-by-reseller-id'
import { totalReturnsByResellerId } from '@/shared/infra/persistence/typeorm/kpi/admin/return-read-methods/total-returns-by-reseller-id'
import { returnsByReseller } from '@/shared/infra/persistence/typeorm/kpi/admin/return-read-methods/returns-by-reseller'
import { totalReturnsByReseller } from '@/shared/infra/persistence/typeorm/kpi/admin/return-read-methods/total-returns-by-reseller'
import { returnsInPeriod } from '@/shared/infra/persistence/typeorm/kpi/admin/return-read-methods/returns-in-period'
import { totalReturnsInPeriod } from '@/shared/infra/persistence/typeorm/kpi/admin/return-read-methods/total-returns-in-period'

export class ReturnReadTypeormRepository implements ReturnReadRepository {
  constructor(
    @InjectRepository(ReturnTypeOrmEntity)
    private readonly returnRepo: Repository<ReturnTypeOrmEntity>,
    @InjectRepository(ProductTypeOrmEntity)
    private readonly productRepo: Repository<ProductTypeOrmEntity>
  ) {}

  async ReturnsByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<ReturnByResellerDto> {
    return returnsByResellerId(
      this.returnRepo,
      this.productRepo,
      resellerId,
      qParams
    )
  }

  async TotalReturnsByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<TotalReturnsByResellerDto> {
    return totalReturnsByResellerId(this.returnRepo, resellerId, qParams)
  }

  async ReturnsByReseller(qParams: ParamsDto): Promise<ReturnByResellerDto[]> {
    return returnsByReseller(this.returnRepo, this.productRepo, qParams)
  }

  async TotalReturnsByReseller(
    qParams: ParamsDto
  ): Promise<TotalReturnsByResellerDto[]> {
    return totalReturnsByReseller(this.returnRepo, qParams)
  }

  async ReturnsInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<ReturnsInPeriodDto> {
    return returnsInPeriod(this.returnRepo, this.productRepo, qParams)
  }

  async TotalReturnsInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalReturnsInPeriodDto> {
    return totalReturnsInPeriod(this.returnRepo, qParams)
  }
}
