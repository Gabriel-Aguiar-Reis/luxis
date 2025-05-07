import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { SupplierRepository } from '@/modules/supplier/domain/repositories/supplier.repository'
import { SupplierTypeOrmEntity } from '@/shared/infra/persistence/typeorm/supplier/supplier.typeorm.entity'
import { SupplierMapper } from '@/shared/infra/persistence/typeorm/supplier/mappers/supplier.mapper'
import { UUID } from 'crypto'

@Injectable()
export class SupplierTypeOrmRepository implements SupplierRepository {
  constructor(
    @InjectRepository(SupplierTypeOrmEntity)
    private readonly repository: Repository<SupplierTypeOrmEntity>
  ) {}

  async create(supplier: Supplier): Promise<Supplier> {
    const entity = SupplierMapper.toTypeOrm(supplier)
    await this.repository.save(entity)
    return SupplierMapper.toDomain(entity)
  }

  async findById(id: UUID): Promise<Supplier | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null
    return SupplierMapper.toDomain(entity)
  }

  async update(id: UUID, supplier: Supplier): Promise<Supplier> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) throw new NotFoundException('Supplier not found')
    const updatedEntity = SupplierMapper.toTypeOrm(supplier)
    await this.repository.save(updatedEntity)
    return SupplierMapper.toDomain(updatedEntity)
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id)
  }

  async findAll(): Promise<Supplier[]> {
    const entities = await this.repository.find()
    return entities.map(SupplierMapper.toDomain)
  }
}
