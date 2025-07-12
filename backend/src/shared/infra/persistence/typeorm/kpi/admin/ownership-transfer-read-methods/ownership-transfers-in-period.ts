import { Repository } from 'typeorm'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'

type OwnershipTransferRawResult = {
  id: string
  productId: string
  fromResellerId: string
  toResellerId: string
  transferDate: Date
  status: string
}

export async function ownershipTransfersInPeriod(
  repo: Repository<OwnershipTransferTypeOrmEntity>,
  qParams: ParamsWithMandatoryPeriodDto
): Promise<OwnershipTransferRawResult[]> {
  const qb = repo
    .createQueryBuilder('ownership_transfer')
    .where('ownership_transfer.transfer_date >= :start', { start: qParams.start })
    .andWhere('ownership_transfer.transfer_date <= :end', { end: qParams.end })
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
