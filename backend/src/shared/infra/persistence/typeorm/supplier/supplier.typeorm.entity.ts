import { Column, Entity, PrimaryColumn } from 'typeorm'
import { UUID } from 'crypto'

@Entity('suppliers')
export class SupplierTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column({ name: 'name' })
  name: string

  @Column({ name: 'phone' })
  phone: string
}
