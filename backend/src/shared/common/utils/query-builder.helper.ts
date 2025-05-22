import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

export function baseWhere<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  qParams: ParamsDto,
  timeField: string
): SelectQueryBuilder<T> {
  const { start, end, limit, page } = qParams

  if (start) {
    qb.andWhere(`${timeField} >= :start`, { start })
  }

  if (end) {
    qb.andWhere(`${timeField} <= :end`, { end })
  }

  if (limit) {
    qb.take(limit)

    if (page) {
      qb.skip((page - 1) * limit)
    }
  }

  return qb
}
