import { UUID } from 'crypto'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('product_models')
export class ProductModelTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column()
  name: string

  @Column('uuid')
  categoryId: UUID

  @Column('uuid')
  resellerId: UUID

  @Column('decimal', { precision: 10, scale: 2 })
  suggestedPrice: number

  @Column({ nullable: true })
  description: string
}
