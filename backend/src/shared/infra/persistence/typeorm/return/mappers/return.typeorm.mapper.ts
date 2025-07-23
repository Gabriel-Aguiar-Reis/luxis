import { Return } from '@/modules/return/domain/entities/return.entity'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'

export class ReturnTypeOrmMapper {
  static toDomain(raw: ReturnTypeOrmEntity): Return {
    return new Return(
      raw.id,
      raw.resellerId,
      raw.productIds,
      raw.status,
      raw.createdAt
    )
  }

  static toPersistence(returnEntity: Return): ReturnTypeOrmEntity {
    const entity = new ReturnTypeOrmEntity()
    entity.id = returnEntity.id
    entity.resellerId = returnEntity.resellerId
    entity.productIds = returnEntity.productIds
    entity.status = returnEntity.status
    entity.createdAt = returnEntity.createdAt
    return entity
  }
}
