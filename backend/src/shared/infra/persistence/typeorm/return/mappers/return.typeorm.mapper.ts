import { Return } from '@/modules/return/domain/entities/return.entity'
import { ReturnTypeOrmEntity } from '../return.typeorm.entity'

export class ReturnTypeOrmMapper {
  static toDomain(raw: ReturnTypeOrmEntity): Return {
    return new Return(
      raw.id,
      raw.resellerId,
      raw.items,
      raw.status,
      raw.createdAt
    )
  }

  static toPersistence(returnEntity: Return): ReturnTypeOrmEntity {
    const entity = new ReturnTypeOrmEntity()
    entity.id = returnEntity.id
    entity.resellerId = returnEntity.resellerId
    entity.items = returnEntity.items
    entity.status = returnEntity.status
    entity.createdAt = returnEntity.createdAt
    return entity
  }
}
