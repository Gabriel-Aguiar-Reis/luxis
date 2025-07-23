import { UUID } from 'crypto'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('batches')
export class BatchTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('date', { name: 'arrival_date' })
  arrivalDate: Date

  @Column('uuid', { name: 'supplier_id' })
  supplierId: UUID
}
