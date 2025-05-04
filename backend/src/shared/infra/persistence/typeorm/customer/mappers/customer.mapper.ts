import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { CustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.entity'

export class CustomerMapper {
  static toDomain(entity: CustomerTypeOrmEntity): Customer {
    return new Customer(
      entity.id,
      new Name(entity.name),
      new PhoneNumber(entity.phone)
    )
  }

  static toTypeOrm(customer: Customer): CustomerTypeOrmEntity {
    const entity = new CustomerTypeOrmEntity()
    entity.id = customer.id
    entity.name = customer.name.getValue()
    entity.phone = customer.phone.getValue()
    return entity
  }
}
