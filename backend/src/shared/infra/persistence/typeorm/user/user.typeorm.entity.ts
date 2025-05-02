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
    type: 'enum',
    enum: Role
  })
  role: Role

  @Column('jsonb')
  residence: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    country: string
    zipCode: string
  }

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: UserStatus
}
