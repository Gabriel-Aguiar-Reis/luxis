import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { Repository } from 'typeorm'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { TotalReturnsByResellerDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-by-reseller.dto'

export async function totalReturnsByResellerId(
  returnRepo: Repository<ReturnTypeOrmEntity>,
  resellerId: UUID,
  qParams: ParamsDto
): Promise<TotalReturnsByResellerDto> {
  const qb = returnRepo
    .createQueryBuilder('return')
    .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.reseller_id')
    .where('return.reseller_id = :resellerId', { resellerId })
    .select([
      'user.id as "resellerId"',
      `CONCAT(user.name, ' ', user.surname) as "resellerName"`,
      'COUNT(return.id) as "totalReturns"'
    ])
    .groupBy('user.id, user.name, user.surname')

  const filteredReturns = baseWhere(qb, qParams, 'return.created_at')
  const result = await filteredReturns.getRawOne<TotalReturnsByResellerDto>()

  return result || { resellerId, resellerName: '', totalReturns: 0 }
}
