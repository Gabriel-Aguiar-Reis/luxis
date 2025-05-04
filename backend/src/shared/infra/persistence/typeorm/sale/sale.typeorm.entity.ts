import { Column, Entity, PrimaryColumn } from 'typeorm'
import { UUID } from 'crypto'
import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'

@Entity('sales')
export class SaleTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('uuid')
  resellerId: UUID

  @Column('uuid', { array: true })
  productIds: UUID[]

  @Column('timestamp')
  saleDate: Date

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number

  @Column('enum', { enum: PaymentMethod })
  paymentMethod: PaymentMethod

  @Column('int')
  numberInstallments: number

  @Column('int')
  installmentsInterval: number

  @Column('enum', { enum: SaleStatus })
  status: SaleStatus

  @Column('boolean', { array: true })
  installments: boolean[]
}
