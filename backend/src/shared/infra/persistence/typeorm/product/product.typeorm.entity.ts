import { Column, Entity, PrimaryColumn } from 'typeorm'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { UUID } from 'crypto'

@Entity('products')
export class ProductTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column()
  serialNumber: string

  @Column('uuid')
  modelId: UUID

  @Column('uuid')
  batchId: UUID

  @Column('decimal', { precision: 10, scale: 2 })
  unitCost: number

  @Column('decimal', { precision: 10, scale: 2 })
  salePrice: number

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.IN_STOCK
  })
  status: ProductStatus
}
