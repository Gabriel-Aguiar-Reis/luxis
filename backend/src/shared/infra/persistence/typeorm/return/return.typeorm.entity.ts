import { UUID } from 'crypto'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'
@Entity('returns')
export class ReturnTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column()
  resellerId: UUID

  @Column('jsonb')
  items: UUID[]

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({
    type: 'enum',
    enum: ReturnStatus,
    default: ReturnStatus.PENDING
  })
  status: ReturnStatus
}
