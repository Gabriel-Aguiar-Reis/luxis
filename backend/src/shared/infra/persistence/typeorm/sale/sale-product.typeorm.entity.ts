import { UUID } from 'crypto'
import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity('sale_products')
@Index('IDX_sale_products_product_id', ['productId'])
export class SaleProductTypeOrmEntity {
  @PrimaryColumn('uuid', { name: 'sale_id' })
  saleId: UUID

  @PrimaryColumn('uuid', { name: 'product_id' })
  productId: UUID

  @Column('int', { name: 'position' })
  position: number
}
