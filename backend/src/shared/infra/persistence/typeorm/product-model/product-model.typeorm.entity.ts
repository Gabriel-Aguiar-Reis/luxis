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

  @Column('decimal', { precision: 10, scale: 2 })
  suggestedPrice: string

  @Column({ nullable: true })
  description: string

  @Column()
  photoUrl: string
}
