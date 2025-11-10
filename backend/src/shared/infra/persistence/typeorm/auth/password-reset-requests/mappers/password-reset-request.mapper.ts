import { PasswordResetRequest } from '@/modules/auth/domain/entities/password-reset-request.entity'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Email } from '@/shared/common/value-object/email.vo'
import { PasswordResetRequestTypeOrmEntity } from '@/shared/infra/persistence/typeorm/auth/password-reset-requests/password-reset-requests.typeorm.entity'

export class PasswordResetRequestMapper {
  static toTypeOrmEntity(
    request: PasswordResetRequest
  ): PasswordResetRequestTypeOrmEntity {
    const entity = new PasswordResetRequestTypeOrmEntity()
    entity.id = request.id
    entity.userId = request.userId
    entity.username = request.username
    entity.email = request.email.getValue()
    entity.phone = request.phone.getValue()
    entity.token = request.token
    entity.status = request.status
    entity.createdAt = request.createdAt
    entity.approvedAt = request.approvedAt
    entity.rejectedAt = request.rejectedAt
    entity.completedAt = request.completedAt
    return entity
  }

  static toDomainEntity(
    entity: PasswordResetRequestTypeOrmEntity
  ): PasswordResetRequest {
    const request = new PasswordResetRequest()
    request.id = entity.id
    request.userId = entity.userId
    request.username = entity.username
    request.email = new Email(entity.email)
    request.phone = new PhoneNumber(entity.phone)
    request.token = entity.token
    request.status = entity.status
    request.createdAt = entity.createdAt
    request.approvedAt = entity.approvedAt
    request.rejectedAt = entity.rejectedAt
    request.completedAt = entity.completedAt
    return request
  }
}
