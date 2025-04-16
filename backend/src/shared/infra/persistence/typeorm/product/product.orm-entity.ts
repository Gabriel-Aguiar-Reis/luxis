import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  serialNumber: string

  @Column()
  modelId: string

  @Column()
  batchId: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitCost: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salePrice: string

  @Column({ type: 'enum', enum: ProductStatus })
  status: ProductStatus
}
