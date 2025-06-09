import { Column, Entity, PrimaryColumn } from 'typeorm'
import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { UUID } from 'crypto'

@Entity('ownership_transfers')
export class OwnershipTransferTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('uuid', { name: 'product_id' })
  productId: UUID

  @Column('uuid', { name: 'from_reseller_id' })
  fromResellerId: UUID

  @Column('uuid', { name: 'to_reseller_id' })
  toResellerId: UUID

  @Column('date', { name: 'transfer_date' })
  transferDate: Date

  @Column('enum', { name: 'status', enum: OwnershipTransferStatus })
  status: OwnershipTransferStatus
}
