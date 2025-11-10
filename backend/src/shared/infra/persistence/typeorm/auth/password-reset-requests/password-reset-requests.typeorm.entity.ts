import { PasswordResetRequestStatus } from '@/modules/auth/domain/enums/password-reset-request-status.enum'
import { UUID } from 'crypto'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm'

@Entity('password_reset_requests')
export class PasswordResetRequestTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column({ name: 'user_id', type: 'uuid' })
  userId: UUID

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column({ unique: true })
  token: string

  @Column({
    type: 'enum',
    enum: PasswordResetRequestStatus,
    default: PasswordResetRequestStatus.PENDING
  })
  status: PasswordResetRequestStatus

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'approved_at', nullable: true })
  approvedAt?: Date

  @Column({ name: 'rejected_at', nullable: true })
  rejectedAt?: Date

  @Column({ name: 'completed_at', nullable: true })
  completedAt?: Date
}
