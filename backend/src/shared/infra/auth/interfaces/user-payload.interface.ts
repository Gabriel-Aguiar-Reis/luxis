import { UUID } from 'crypto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'

export interface UserPayload {
  id: UUID
  email: string
  role: Role
  status: UserStatus
  name: string
}
