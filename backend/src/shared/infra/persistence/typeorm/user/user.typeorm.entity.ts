import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { UUID } from 'crypto'

@Entity('users')
export class UserTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column({ name: 'name' })
  name: string

  @Column({ name: 'surname' })
  surname: string

  @Column({ name: 'phone' })
  phone: string

  @Column({ name: 'email', unique: true })
  email: string

  @Column({ name: 'password_hash' })
  passwordHash: string

  @Column('enum', { name: 'role', enum: Role })
  role: Role

  @Column({ name: 'residence' })
  residence: string

  @Column('enum', { name: 'status', enum: UserStatus })
  status: UserStatus
}
