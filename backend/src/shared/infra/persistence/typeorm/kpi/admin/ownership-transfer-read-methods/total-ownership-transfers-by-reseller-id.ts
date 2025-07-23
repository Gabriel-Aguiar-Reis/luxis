import { Repository } from 'typeorm'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { UUID } from 'crypto'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'

export async function totalOwnershipTransfersByResellerId(
  repo: Repository<OwnershipTransferTypeOrmEntity>,
  id: UUID,
  qParams: ParamsDto
): Promise<number> {
  const qb = repo
    .createQueryBuilder('ownership_transfer')
    .where('ownership_transfer.from_reseller_id = :id', { id })
  const filtered = baseWhere(qb, qParams, 'ownership_transfer.transfer_date')
  return filtered.getCount()
}
