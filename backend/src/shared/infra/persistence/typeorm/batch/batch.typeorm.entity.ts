import { UUID } from 'crypto'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('batches')
export class BatchTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('timestamp', {
    name: 'arrival_date',
    default: () => 'CURRENT_TIMESTAMP'
  })
  arrivalDate: Date

  @Column('uuid', { name: 'supplier_id' })
  supplierId: UUID
}
