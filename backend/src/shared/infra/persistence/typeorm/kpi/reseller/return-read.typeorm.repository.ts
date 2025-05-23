import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ReturnReadRepository } from '@/modules/kpi/reseller/domain/repositories/return-read.repository'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'

@Injectable()
export class ReturnReadTypeormRepository implements ReturnReadRepository {
  constructor(private readonly returnRepo: Repository<ReturnTypeOrmEntity>) {}

  async returnsMadeByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<number> {
    const qb = this.returnRepo
      .createQueryBuilder('return')
      .where('return.reseller_id = :resellerId', { resellerId })

    const filteredReturns = baseWhere(qb, qParams, 'return.created_at')

    return await filteredReturns.getCount()
  }
}
