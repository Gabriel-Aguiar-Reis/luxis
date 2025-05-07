import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { UUID } from 'crypto'

export abstract class SaleRepository {
  abstract findAll(): Promise<Sale[]>
  abstract findById(id: UUID): Promise<Sale | null>
  abstract findByResellerId(resellerId: UUID): Promise<Sale[]>
  abstract create(sale: Sale): Promise<Sale>
  abstract update(sale: Sale): Promise<Sale>
  abstract delete(id: UUID): Promise<void>
}
