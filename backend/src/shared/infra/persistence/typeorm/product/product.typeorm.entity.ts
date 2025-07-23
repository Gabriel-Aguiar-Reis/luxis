import { Column, Entity, PrimaryColumn } from 'typeorm'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { UUID } from 'crypto'

@Entity('products')
export class ProductTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column({ name: 'serial_number' })
  serialNumber: string

  @Column('uuid', { name: 'model_id' })
  modelId: UUID

  @Column('uuid', { name: 'batch_id' })
  batchId: UUID

  @Column('decimal', { precision: 10, scale: 2, name: 'unit_cost' })
  unitCost: string

  @Column('decimal', { precision: 10, scale: 2, name: 'sale_price' })
  salePrice: string

  @Column('enum', { name: 'status', enum: ProductStatus })
  status: ProductStatus

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date
}
