import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { SupplierTypeOrmEntity } from '@/shared/infra/persistence/typeorm/supplier/supplier.typeorm.entity'

export class SupplierMapper {
  static toDomain(entity: SupplierTypeOrmEntity): Supplier {
    return new Supplier(
      entity.id,
      new Name(entity.name),
      new PhoneNumber(entity.phone)
    )
  }

  static toTypeOrm(supplier: Supplier): SupplierTypeOrmEntity {
    const entity = new SupplierTypeOrmEntity()
    entity.id = supplier.id
    entity.name = supplier.name.getValue()
    entity.phone = supplier.phone.getValue()
    return entity
  }
}
