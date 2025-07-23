import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { Repository } from 'typeorm'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { TotalReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-in-period.dto'

export async function totalReturnsInPeriod(
  returnRepo: Repository<ReturnTypeOrmEntity>,
  qParams: ParamsWithMandatoryPeriodDto
): Promise<TotalReturnsInPeriodDto> {
  const qb = returnRepo.createQueryBuilder('return')
  const filteredReturns = baseWhere(qb, qParams, 'return.created_at')
  const totalReturns = await filteredReturns.getCount()
  return {
    start: qParams.start,
    end: qParams.end,
    totalReturns
  }
}
