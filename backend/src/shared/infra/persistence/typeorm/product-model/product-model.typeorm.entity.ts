import { ProductModelStatus } from '@/modules/product-model/domain/enums/product-model-status.enum'
import { UUID } from 'crypto'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('product_models')
export class ProductModelTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column({ name: 'name' })
  name: string

  @Column('uuid', { name: 'category_id' })
  categoryId: UUID

  @Column('decimal', { precision: 10, scale: 2, name: 'suggested_price' })
  suggestedPrice: string

  @Column({ name: 'description', nullable: true })
  description: string

  @Column({ name: 'photo_url' })
  photoUrl: string

  @Column({
    type: 'enum',
    enum: ProductModelStatus,
    default: ProductModelStatus.ACTIVE,
    name: 'status'
  })
  status: ProductModelStatus
}
