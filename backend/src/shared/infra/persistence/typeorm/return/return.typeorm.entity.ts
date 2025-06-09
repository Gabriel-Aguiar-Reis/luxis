import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'
import { UUID } from 'crypto'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
@Entity('returns')
export class ReturnTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column({ name: 'reseller_id' })
  resellerId: UUID

  @Column('uuid', { array: true, name: 'product_ids' })
  productIds: UUID[]

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

  @Column('enum', { name: 'status', enum: ReturnStatus })
  status: ReturnStatus
}
