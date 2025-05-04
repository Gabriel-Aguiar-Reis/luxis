import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { CustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.entity'
import { CustomerMapper } from '@/shared/infra/persistence/typeorm/customer/mappers/customer.mapper'
import { UUID } from 'crypto'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'

@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerTypeOrmEntity)
    private readonly repository: Repository<CustomerTypeOrmEntity>
  ) {}
  async findAllByIds(ids: UUID[]): Promise<Customer[]> {
    const entities = await this.repository.find({ where: { id: In(ids) } })
    return entities.map(CustomerMapper.toDomain)
  }

  async create(customer: Customer): Promise<Customer> {
    const entity = CustomerMapper.toTypeOrm(customer)
    const savedEntity = await this.repository.save(entity)
    return CustomerMapper.toDomain(savedEntity)
  }

  async findById(id: UUID): Promise<Customer | null> {
    const entity = await this.repository.findOne({
      where: { id }
    })

    if (!entity) return null

    return CustomerMapper.toDomain(entity)
  }

  async update(customer: Customer): Promise<Customer> {
    const entity = await this.repository.findOne({ where: { id: customer.id } })
    if (!entity) throw new NotFoundException('Customer not found')
    const updatedEntity = CustomerMapper.toTypeOrm(customer)
    const savedEntity = await this.repository.save(updatedEntity)
    return CustomerMapper.toDomain(savedEntity)
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id)
  }

  async findAll(): Promise<Customer[]> {
    const entities = await this.repository.find()
    return entities.map(CustomerMapper.toDomain)
  }
}
