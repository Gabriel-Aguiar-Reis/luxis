import { Repository } from 'typeorm'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'

export async function totalOwnershipTransfersInPeriod(
  repo: Repository<OwnershipTransferTypeOrmEntity>,
  qParams: ParamsWithMandatoryPeriodDto
): Promise<number> {
  const qb = repo
    .createQueryBuilder('ownership_transfer')
  const filtered = baseWhere(qb, qParams, 'ownership_transfer.transfer_date')
  return filtered.getCount()
}
