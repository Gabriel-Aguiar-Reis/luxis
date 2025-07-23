import { Column, Entity, PrimaryColumn } from 'typeorm'
import { UUID } from 'crypto'
import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'

@Entity('sales')
export class SaleTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('uuid', { name: 'customer_id', nullable: true })
  customerId: UUID

  @Column('uuid', { name: 'reseller_id' })
  resellerId: UUID

  @Column('uuid', { array: true, name: 'product_ids' })
  productIds: UUID[]

  @Column('date', { name: 'sale_date' })
  saleDate: Date

  @Column('decimal', { precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: string

  @Column('enum', { name: 'payment_method', enum: PaymentMethod })
  paymentMethod: PaymentMethod

  @Column('int', { name: 'number_installments' })
  numberInstallments: number

  @Column('int', { name: 'installments_interval' })
  installmentsInterval: number

  @Column('enum', { name: 'status', enum: SaleStatus })
  status: SaleStatus

  @Column('int', { name: 'installments_paid', default: 0 })
  installmentsPaid: number
}
