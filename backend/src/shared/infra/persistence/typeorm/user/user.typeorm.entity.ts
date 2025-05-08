import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { UUID } from 'crypto'

@Entity('users')
export class UserTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column()
  name: string

  @Column()
  surName: string

  @Column()
  phone: string

  @Column()
  email: string

  @Column()
  passwordHash: string

  @Column({
    type: 'text',
    default: Role.UNASSIGNED
  })
  role: Role

  @Column()
  residence: string

  @Column({
    type: 'text',
    default: UserStatus.PENDING
  })
  status: UserStatus
}
