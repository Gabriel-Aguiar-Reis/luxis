import { User } from '@/modules/user/domain/entities/user.entity'
import { Role } from '@/modules/user/domain/enums/user-role.enum'

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>
  abstract findById(id: string): Promise<User | null>
  abstract create(user: User): Promise<User>
  abstract update(user: User): Promise<User>
  abstract updateRole(id: string, role: Role): Promise<User>
  abstract delete(id: string): Promise<void>
}
