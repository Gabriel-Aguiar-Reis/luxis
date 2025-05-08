import { User } from '@/modules/user/domain/entities/user.entity'
import { Email } from '@/shared/common/value-object/email.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Residence } from '@/modules/user/domain/value-objects/residence.vo'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { Address } from '@/modules/user/domain/value-objects/address.vo'
import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import { PostalCode } from '@/modules/user/domain/value-objects/postal-code.vo'
import { Country } from '@/modules/user/domain/enums/country.enum'

export class UserMapper {
  static toDomain(entity: UserTypeOrmEntity): User {
    let residence: Residence
    if (entity.residence.split(',').length === 5) {
      const residenceParts = entity.residence.split(',')
      const [street, numberAndNeighborhood, cityAndState, postalCode, country] =
        residenceParts
      const [number, neighborhood] = numberAndNeighborhood.split(' - ')
      const [city, state] = cityAndState.split(' - ')

      residence = new Residence(
        new Address(
          street.trim(),
          Number(number.trim()),
          neighborhood.trim(),
          city.trim(),
          state.trim() as FederativeUnit,
          new PostalCode(postalCode.trim()),
          country.trim() as Country
        )
      )
    } else if (entity.residence.split(',').length === 6) {
      const residenceParts = entity.residence.split(',')
      const [
        street,
        number,
        complementAndNeighborhood,
        cityAndState,
        postalCode,
        country
      ] = residenceParts

      const [complement, neighborhood] = complementAndNeighborhood
        .split(' - ')
        .filter(Boolean)
      const [city, state] = cityAndState.split(' - ')

      residence = new Residence(
        new Address(
          street.trim(),
          Number(number.trim()),
          neighborhood.trim(),
          city.trim(),
          state.trim() as FederativeUnit,
          new PostalCode(postalCode.trim()),
          country.trim() as Country,
          complement.trim()
        )
      )
    } else {
      throw new Error('Invalid residence format')
    }

    return new User(
      entity.id,
      new Name(entity.name),
      new Name(entity.surName),
      new PhoneNumber(entity.phone),
      new Email(entity.email),
      new PasswordHash(entity.passwordHash),
      entity.role,
      residence,
      entity.status
    )
  }

  static toTypeOrm(user: User): UserTypeOrmEntity {
    const entity = new UserTypeOrmEntity()
    entity.id = user.id
    entity.name = user.name.getValue()
    entity.surName = user.surName.getValue()
    entity.phone = user.phone.getValue()
    entity.email = user.email.getValue()
    entity.passwordHash = user.passwordHash.getValue()
    entity.role = user.role
    entity.residence = user.residence.getValue()
    entity.status = user.status
    return entity
  }

  static toResponse(user: User): any {
    return {
      id: user.id,
      name: user.name.getValue(),
      surName: user.surName.getValue(),
      phone: user.phone.getValue(),
      email: user.email.getValue(),
      role: user.role,
      residence: user.residence.getValue(),
      status: user.status
    }
  }
}
