import { Column, Entity, PrimaryColumn } from 'typeorm'
import { UUID } from 'crypto'

@Entity('customers')
export class CustomerTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column({ name: 'name' })
  name: string

  @Column({ name: 'phone' })
  phone: string
}
