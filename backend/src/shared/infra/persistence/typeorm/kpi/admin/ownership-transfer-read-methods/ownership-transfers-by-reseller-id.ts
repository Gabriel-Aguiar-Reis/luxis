import { Repository } from 'typeorm'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { UUID } from 'crypto'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'

type OwnershipTransferRawResult = {
  id: UUID
  productId: UUID
  fromResellerId: UUID
  toResellerId: UUID
  transferDate: Date
  status: string
}

export async function ownershipTransfersByResellerId(
  repo: Repository<OwnershipTransferTypeOrmEntity>,
  id: UUID,
  qParams: ParamsDto
): Promise<OwnershipTransferRawResult[]> {
  const qb = repo
    .createQueryBuilder('ownership_transfer')
    .where('ownership_transfer.from_reseller_id = :id', { id })
    .select([
      'ownership_transfer.id as "id"',
      'ownership_transfer.product_id as "productId"',
      'ownership_transfer.from_reseller_id as "fromResellerId"',
      'ownership_transfer.to_reseller_id as "toResellerId"',
      'ownership_transfer.transfer_date as "transferDate"',
      'ownership_transfer.status as "status"'
    ])
  const filtered = baseWhere(qb, qParams, 'ownership_transfer.transfer_date')
  return filtered.getRawMany<OwnershipTransferRawResult>()
}
