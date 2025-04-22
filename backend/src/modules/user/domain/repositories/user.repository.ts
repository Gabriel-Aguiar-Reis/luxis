import { User } from '@/modules/user/domain/entities/user.entity'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UUID } from 'crypto'

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>
  abstract findById(id: UUID): Promise<User | null>
  abstract create(user: User): Promise<User>
  abstract update(user: User): Promise<User>
  abstract updateRole(id: UUID, role: Role): Promise<User>
  abstract delete(id: UUID): Promise<void>
  abstract disable(id: UUID): Promise<User>
}
