import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'

export class OwnershipTransferMapper {
  static toDomain(entity: OwnershipTransferTypeOrmEntity): OwnershipTransfer {
    return new OwnershipTransfer(
      entity.id,
      entity.productId,
      entity.fromResellerId,
      entity.toResellerId,
      entity.transferDate,
      entity.status
    )
  }

  static toTypeOrm(
    transfer: OwnershipTransfer
  ): OwnershipTransferTypeOrmEntity {
    const entity = new OwnershipTransferTypeOrmEntity()
    entity.id = transfer.id
    entity.productId = transfer.productId
    entity.fromResellerId = transfer.fromResellerId
    entity.toResellerId = transfer.toResellerId
    entity.transferDate = transfer.transferDate
    entity.status = transfer.status
    return entity
  }
}
