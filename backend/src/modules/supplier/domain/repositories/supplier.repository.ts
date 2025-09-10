import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { UUID } from 'crypto'

export interface SupplierRepository {
  create(supplier: Supplier): Promise<Supplier>
  findById(id: UUID): Promise<Supplier | null>
  findManyByIds(ids: UUID[]): Promise<Supplier[]>
  findAll(): Promise<Supplier[]>
  update(id: UUID, supplier: Supplier): Promise<Supplier>
  delete(id: UUID): Promise<void>
}
