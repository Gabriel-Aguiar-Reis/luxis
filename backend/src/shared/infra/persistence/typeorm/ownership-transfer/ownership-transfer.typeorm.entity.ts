import { Column, Entity, PrimaryColumn } from 'typeorm'
import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { UUID } from 'crypto'

@Entity('ownership_transfers')
export class OwnershipTransferTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('uuid')
  productId: UUID

  @Column('uuid')
  fromResellerId: UUID

  @Column('uuid')
  toResellerId: UUID

  @Column('timestamp')
  transferDate: Date

  @Column({
    type: 'enum',
    enum: OwnershipTransferStatus,
    default: OwnershipTransferStatus.PENDING
  })
  status: OwnershipTransferStatus
}
