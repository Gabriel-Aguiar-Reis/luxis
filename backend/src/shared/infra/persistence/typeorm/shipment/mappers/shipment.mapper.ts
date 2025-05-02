import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'
import { ShipmentTypeOrmEntity } from '@/shared/infra/persistence/typeorm/shipment/shipment.typeorm.entity'

export class ShipmentMapper {
  static toDomain(entity: ShipmentTypeOrmEntity): Shipment {
    return new Shipment(
      entity.id,
      entity.resellerId,
      entity.createdAt,
      entity.status,
      entity.productIds
    )
  }

  static toTypeOrm(shipment: Shipment): ShipmentTypeOrmEntity {
    const entity = new ShipmentTypeOrmEntity()
    entity.id = shipment.id
    entity.resellerId = shipment.resellerId
    entity.createdAt = shipment.createdAt
    entity.status = shipment.status
    entity.productIds = shipment.productIds
    return entity
  }
}
