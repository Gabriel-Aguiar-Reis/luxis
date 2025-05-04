import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { UUID } from 'crypto'

export interface CustomerRepository {
  create(customer: Customer): Promise<Customer>
  findAll(): Promise<Customer[]>
  findAllByIds(ids: UUID[]): Promise<Customer[]>
  findById(id: UUID): Promise<Customer | null>
  update(customer: Customer): Promise<Customer>
  delete(id: UUID): Promise<void>
}
